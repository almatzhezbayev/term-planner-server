## Parser Output

The parser extracts information from the transcript PDF and returns a normalized object.

Example:

~~~javascript
{
  admitTerm: "22-23f",
  school: "science",
  major: "math-cs",

  semesters: {
    "22-23f": ["CHEM1020", "CHEM1050", "MATH1012"],
    "22-23s": ["MATH1014", "COMP1022P"],
    "23-24f": ["COMP2011", "MATH2023"]
  }
}
~~~

Fields:

| Field | Description |
|---|---|
| `admitTerm` | admission semester (`YY-YYt` format) |
| `school` | student's school |
| `major` | major identifier |
| `semesters` | mapping of semester → courses taken |

Semesters are sorted chronologically.

---

## Requirement Tree Node schema

Program requirements are represented as a **heterogeneous tree**.

Each node represents a logical constraint on courses.

---

## Node Types

There are four node types.

### 1. AND node

All child nodes must be satisfied.

~~~javascript
{
  type: "and",
  nodes: [...]
}
~~~

### 2. OR node

At least one child node must be satisfied.

~~~javascript
{
  type: "or",
  nodes: [...]
}
~~~

### 3. Course List leaf node

Represents a requirement to take `count` courses from a specific list.

~~~javascript
{
  courses: ["COURSE1", "COURSE2", "COURSE3"],
  count: 2
}
~~~

Meaning:

~~~text
take at least 2 courses from the list
~~~

Common patterns:

| Pattern | Representation |
|---|---|
| required course | `{ courses: ["A"], count: 1 }` |
| A OR B | `{ courses: ["A", "B"], count: 1 }` |
| choose 2 of 3 | `{ courses: ["A", "B", "C"], count: 2 }` |
| all courses required | `{ courses: ["A", "B", "C"], count: 3 }` |

### 4. Elective leaf node

Represents electives defined by department code and course level.

~~~javascript
{
  elective: {
    code: "MATH",
    level: 3000
  },
  count: 2
}
~~~

Meaning:

~~~text
take 2 MATH courses numbered 3000 or above
~~~

---

## node Grammar

Formally, the node schema is:

~~~text
node =
    { type: "and", nodes: node[] }
  | { type: "or", nodes: node[] }
  | { courses: string[], count: number }
  | { elective: { code: string, level: number }, count: number }
~~~

---

## Tree Structure

nodes form a tree, where:

- **internal nodes** are logical operators (`and`, `or`)
- **leaf nodes** represent course / elective constraints

Example:

~~~text
OR
├── AND
│   ├── courses: [MATH1012, MATH1013], count: 1
│   └── courses: [MATH1014, MATH1024], count: 1
└── courses: [MATH1020], count: 1
~~~

This corresponds to:

~~~text
(MATH1012 OR MATH1013) AND (MATH1014 OR MATH1024)
OR
MATH1020
~~~

---

## Example Requirement

Example node for a program requirement:

~~~javascript
type: "and",
rules: [
  { courses: ["MATH2343", "MATH3121", "COMP2611"], count: 3 },
  { courses: ["COMP3711", "COMP3711H"], count: 1 },
  {
    type: "or",
    rules: [
      { courses: ["COMP2011", "COMP2012"], count: 2 },
      {
        type: "and",
        rules: [
          { courses: ["COMP2012H"], count: 1 },
          {
            courses: [
              "COMP3031",
              "COMP3111",
              "COMP3111H",
              "COMP3211",
              "COMP3311",
              "COMP3511",
            ],
            count: 1,
          },
        ],
      },
    ],
  },
  {
    elec: {
      code: "MATH",
      lvl: 3000,
    },
    count: 1,
  },
  {
    courses: [
      "MATH2001",
      "MATH2411",
      "MATH2421",
      "MATH2431",
      "MATH3312",
      "MATH3322",
      "MATH3332",
      "MATH3343",
      "MATH4023",
      "MATH4141",
      "MATH4223",
      "MATH4321",
      "MATH4343",
    ],
    count: 2,
  },
  {
    elec: {
      code: "COMP",
      lvl: 4000,
    },
    count: 1,
  },
],
~~~

This encodes the requirement:

~~~text
(MATH2343) AND (MATH3121) AND (COMP2611)
AND
(COMP3711 OR COMP3711H)
AND
(
  COMP2011 AND COMP2012
  OR
  COMP2012H + one COMP elective
)
AND
(MATH3000+ elective) AND (two MATH electives) AND (COMP4000+ elective)
~~~

---