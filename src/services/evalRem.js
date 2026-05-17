const evalRem = (courses, admitTerm, school, major) => {
  const SREQ = require(
    `../requirements/${admitTerm.slice(0, -1)}/${school}/SREQ`,
  );

  const majorReqs = require(
    `../requirements/${admitTerm.slice(0, -1)}/${school}/${major.slice(0, -3)}`,
  );

  // console.log(evalSchool(courses, SREQ));

  // evalMajor(courses, majorReqs);
};

// evaluator for major requirements

const pickTaken = (options, takenSet) => {
  for (const course of options) {
    if (takenSet.has(course)) return course;
  }
  return null;
};

const clearAllSets = (obj) => {
  for (const value of Object.values(obj)) {
    if (value instanceof Set) {
      value.clear();
    } else if (value && typeof value === "object") {
      clearAllSets(value);
    }
  }
};

const courseLevel = (course) => {
  const match = course.match(/^[A-Z]+(\d{4})[A-Z]*$/);
  return match ? Number(match[1]) : -1;
};

const isSubjectLevel = (course, subject, minLevel) =>
  course.startsWith(subject) && courseLevel(course) >= minLevel;

// maximum bipartite matching so one course is not reused across elective buckets
const matchElectiveSlots = (courses, slots) => {
  const graph = courses.map((course) =>
    slots
      .map((slot, idx) => (slot.predicate(course) ? idx : -1))
      .filter((idx) => idx !== -1),
  );

  const slotToCourse = Array(slots.length).fill(-1);

  const dfs = (courseIdx, seen) => {
    for (const slotIdx of graph[courseIdx]) {
      if (seen[slotIdx]) continue;
      seen[slotIdx] = true;

      if (slotToCourse[slotIdx] === -1 || dfs(slotToCourse[slotIdx], seen)) {
        slotToCourse[slotIdx] = courseIdx;
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < courses.length; i++) {
    dfs(i, Array(slots.length).fill(false));
  }

  return slotToCourse;
};

const evalMajor = (courses, req) => {
  const progress = {
    prereq: structuredClone(req.prereq),
    core: structuredClone(req.core),
    trackRequired: structuredClone(req.trackRequired),
    electives: structuredClone(req.electiveNeeds),
  };

  // do not double count repeated courses
  const uniqueCourses = [...new Set(courses)];
  const takenSet = new Set(uniqueCourses);

  // courses already consumed by required buckets should not be reused for electives
  const used = new Set();

  // -----------------------------
  // prerequisite
  // -----------------------------
  if (takenSet.has("MATH1020")) {
    clearAllSets(progress.prereq);
    used.add("MATH1020");
  } else {
    const calcI = pickTaken(req.prereq.regularPath.calcI, takenSet);
    const calcII = pickTaken(req.prereq.regularPath.calcII, takenSet);

    if (calcI) progress.prereq.regularPath.calcI.clear();
    if (calcII) progress.prereq.regularPath.calcII.clear();

    if (calcI && calcII) {
      progress.prereq.acceleratedPath.clear();
      used.add(calcI);
      used.add(calcII);
    }
  }

  // -----------------------------
  // common major core
  // -----------------------------
  for (const key of ["multivar", "analysis", "linear", "real", "lang"]) {
    const taken = pickTaken(req.core[key], takenSet);
    if (taken) {
      progress.core[key].clear();
      used.add(taken);
    }
  }

  // -----------------------------
  // track required courses
  // -----------------------------
  for (const key of [
    "discrete",
    "abstractAlgebra",
    "capstone",
    "compOrg",
    "algo",
  ]) {
    const taken = pickTaken(req.trackRequired[key], takenSet);
    if (taken) {
      progress.trackRequired[key].clear();
      used.add(taken);
    }
  }

  // COMP core: prefer regular path if both exist, because that avoids extra COMP 2000+ elective
  const hasRegularCompCore =
    takenSet.has("COMP2011") && takenSet.has("COMP2012");
  const hasHonorsCompCore = takenSet.has("COMP2012H");

  if (hasRegularCompCore) {
    clearAllSets(progress.trackRequired.compCore);
    used.add("COMP2011");
    used.add("COMP2012");
    progress.electives.comp2000PlusNeed = 0;
  } else if (hasHonorsCompCore) {
    clearAllSets(progress.trackRequired.compCore);
    used.add("COMP2012H");
    progress.electives.comp2000PlusNeed = 1;
  } else {
    if (takenSet.has("COMP2011")) {
      progress.trackRequired.compCore.regularPath.comp2011.clear();
    }
    if (takenSet.has("COMP2012")) {
      progress.trackRequired.compCore.regularPath.comp2012.clear();
    }
  }

  // -----------------------------
  // electives
  // -----------------------------
  const remainingPool = uniqueCourses.filter((course) => !used.has(course));
  const slots = [];

  for (let i = 0; i < progress.electives.mathListedNeed; i++) {
    slots.push({
      key: "mathListedNeed",
      predicate: (course) => req.electivePools.mathListed.has(course),
    });
  }

  for (let i = 0; i < progress.electives.math3000PlusNeed; i++) {
    slots.push({
      key: "math3000PlusNeed",
      predicate: (course) => isSubjectLevel(course, "MATH", 3000),
    });
  }

  for (let i = 0; i < progress.electives.compListedNeed; i++) {
    slots.push({
      key: "compListedNeed",
      predicate: (course) => req.electivePools.compListed.has(course),
    });
  }

  for (let i = 0; i < progress.electives.comp4000PlusNeed; i++) {
    slots.push({
      key: "comp4000PlusNeed",
      predicate: (course) => isSubjectLevel(course, "COMP", 4000),
    });
  }

  for (let i = 0; i < progress.electives.comp2000PlusNeed; i++) {
    slots.push({
      key: "comp2000PlusNeed",
      predicate: (course) => isSubjectLevel(course, "COMP", 2000),
    });
  }

  const slotToCourse = matchElectiveSlots(remainingPool, slots);

  for (let i = 0; i < slotToCourse.length; i++) {
    if (slotToCourse[i] !== -1) {
      progress.electives[slots[i].key] -= 1;
    }
  }

  return progress;
};

module.exports = evalMajor;

// supposed to be called with (courses = list of strings with taken courses, progress = SREQ)
const evalSchool = (courses, SREQ) => {
  const progress = structuredClone(SREQ);
  for (const course of courses) {
    // check for COMP
    if (progress.COMP.size != 0 && progress.COMP.has(course)) {
      progress.COMP.clear();
    }

    // check for LANG
    if (progress.LANG.size != 0 && progress.LANG.has(course)) {
      progress.LANG.clear();
    }

    // check for foundations lectures
    for (const discipline of ["CHEM", "LIFS", "MATH", "PHYS"]) {
      if (
        progress.lecs[discipline].has(course) &&
        progress.lecCount[discipline] < progress.lecCap &&
        progress.lecNeed > 0
      ) {
        progress.lecCount[discipline] += 1;
        progress.lecNeed -= 1;
        break;
      }
    }

    if (progress.LABS.size != 0 && progress.LABS.has(course)) {
      progress.LABS.clear();
    }
  }
  return progress;
};

// args
const courses = [
  "COMP2011",
  "HUMA1102",
  "LANG2010H",
  "MATH2023",
  "MATH2121",
  "CHEM1020",
  "CHEM1050",
  "CORE1901",
  "CORE1905A",
  "LIFS1902",
  "MATH1012",
  "CORE1402",
  "CHEM1030",
  "CHEM1055",
  "COMP1022P",
  "CORE1404",
  "CORE1905A",
  "LEGL1000",
  "LIFS1904",
  "MATH1014",
  "COMP2012",
  "COMP2611",
  "ECON1220",
  "LIFS2040",
  "PHYS1101",
  "COMP2711",
  "ELEC1010",
  "MATH2001",
  "MATH2421",
  "MATH3121",
  "COMP3511",
  "COMP3711",
  "HUMA2588",
  "LANG1411",
  "MATH2033",
  "SOSC1860",
  "COMP4211",
  "COMP4651",
  "MATH3033",
  "MATH3322",
  "MATH4999",
];

const admitTerm = "22-23f";
const school = "science";
const major = "math-cs";

evalRem(courses, admitTerm, school, major);

// progress.COMP = false
// progress.LANG = false
// progress.foundations.lab = false
// progress.foundations.lectureTotal = 0
// progress.foundations.byDiscipline = { CHEM: 0, LIFS: 0, MATH: 0, PHYS: 0 }

// FOR each course in courses:

//     IF lookup.COMP has course:
//         progress.COMP = true

//     IF lookup.LANG has course:
//         progress.LANG = true

//     IF lookup.foundationLabs has course:
//         progress.foundations.lab = true

//     IF course exists in lookup.foundationLectureMap:
//         discipline = lookup.foundationLectureMap[course]

//         IF progress.foundations.byDiscipline[discipline] < 3:
//             progress.foundations.byDiscipline[discipline] += 1
//             progress.foundations.lectureTotal += 1
