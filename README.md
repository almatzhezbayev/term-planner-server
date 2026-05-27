# term-planner-server

Express backend for transcript parsing and remaining-requirement evaluation.

## Hosted App

The frontend is already hosted here:

`https://term-planner-client.onrender.com/`

The backend is also deployed on Render. It is hosted on the free tier, so after inactivity the service may need some time to spin back up before the first parse or requirement request completes.

## Run

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3001`.

## Current API

### `POST /api/parse`

Parses a transcript PDF sent as raw request body.

- Content type: `application/pdf`
- Body: raw PDF bytes
- Response:

```json
{
  "school": "science",
  "major": "math-cs",
  "admitTerm": "22-23f",
  "semesters": {
    "22-23f": ["CHEM1020", "CHEM1050", "MATH1012"]
  }
}
```

What happens internally:

1. `src/services/getText.js` extracts plain text from the uploaded PDF using `pdf-parse`.
2. `src/services/parse.js` reads that text and derives:
   - `admitTerm` from the transcript `Admit Date`
   - `major` from the `Major:` line
   - `school` from the `School of ...` line
   - `semesters` by scanning transcript term headers and course codes
3. Courses on transcript lines ending with `F` are skipped, so failed courses are not counted.

### `POST /api/requirements`

Evaluates remaining requirements from already parsed or user-edited transcript data.

- Content type: `application/json`
- Body:

```json
{
  "school": "science",
  "major": "math-cs",
  "admitTerm": "22-23f",
  "semesters": {
    "22-23f": ["CHEM1020", "CHEM1050", "MATH1012"],
    "22-23s": ["MATH1014", "COMP1022P"]
  }
}
```

- Response:

```json
{
  "summary": {
    "remainingBucketCount": 4,
    "totalRemainingCourseCount": 6
  },
  "remaining": {
    "school": [],
    "commonCore": [],
    "major": [
      {
        "id": "major.core.real",
        "label": "Core: Real analysis",
        "kind": "course-options",
        "remainingCount": 1,
        "options": ["MATH3033", "MATH3043"]
      }
    ]
  },
  "recommendations": [
    {
      "id": "major.core.real",
      "label": "Core: Real analysis",
      "remainingCount": 1,
      "options": ["MATH3033", "MATH3043"]
    }
  ]
}
```

## Data Sources

All requirement data is currently local and code-defined.

- `src/requirements/22-23/science/SREQ.js`
  - School-level Science requirements used by the evaluator
  - Includes common COMP requirement, common LANG requirement, foundation lecture buckets, and foundation lab bucket
- `src/requirements/22-23/science/math.js`
  - Current major-requirement definition used by the evaluator
  - The exported structure at the bottom of the file is the active one
  - Right now the evaluator is implemented for `math-cs`
- `src/requirements/22-23/science/cc_sci.js`
  - Science common-core requirements for the 30-credit curriculum
  - Includes required credit buckets, eligible course catalog, and legacy `CORE` aliases
- `src/requirements/course_equivalents.js`
  - Normalizes transcript course codes before evaluation
  - Example: `LANG2010H` counts as `LANG2010`, `CHEM1020` counts as `CHEM1011`

The requirement files were manually encoded from HKUST requirement references, noted in comments inside those files. There is no database and no live external fetch.

## Storage Model

The backend does not persist user data.

- Uploaded PDFs are processed in memory.
- Parsed transcript objects are returned to the client only.
- Requirement evaluation is computed from the request payload only.

## Requirement Evaluation Notes

`src/services/evalRem.js` currently does four things:

1. Flattens all semester course arrays into a single deduplicated course list.
2. Applies course equivalence normalization from `course_equivalents.js`.
3. Evaluates school-level requirements from `SREQ.js`.
4. Evaluates science common core credit buckets from `cc_sci.js`.
5. Evaluates major requirements and elective buckets from `math.js`.

Major elective matching uses bipartite matching so one taken course is not reused across multiple elective buckets.

## Current Limitations

- Remaining-requirement evaluation is currently implemented for `science` / `math-cs`.
- `/api/parse` expects transcript formatting close to the current HKUST transcript PDF layout.
- There is no authentication, database, or file storage.
