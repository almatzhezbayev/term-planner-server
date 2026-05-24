const courseAliases = require("../requirements/course_equivalents");
const { getSchoolCatalog, getProgramCatalog } = require("../requirements/catalog");

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

  for (let i = 0; i < courses.length; i += 1) {
    dfs(i, Array(slots.length).fill(false));
  }

  return slotToCourse;
};

const setToSortedArray = (set) => [...set].sort();
const sum = (numbers) => numbers.reduce((total, value) => total + value, 0);

const normalizeUniqueCourses = (courses) => [...new Set(courses)];

// const normalizeMajorCourses = (courses) =>
//   normalizeUniqueCourses(
//     courses.map((course) => courseAliases[course] ?? course),
//   );

const evalMajor = (courses, req) => {
  const progress = {
    prereq: structuredClone(req.prereq),
    core: structuredClone(req.core),
    trackRequired: structuredClone(req.trackRequired),
    electives: structuredClone(req.electiveNeeds),
  };

  const uniqueCourses = normalizeUniqueCourses(courses);
  const takenSet = new Set(uniqueCourses);
  const used = new Set();

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

  for (const key of ["multivar", "analysis", "linear", "real", "lang"]) {
    const taken = pickTaken(req.core[key], takenSet);
    if (taken) {
      progress.core[key].clear();
      used.add(taken);
    }
  }

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
      used.add("COMP2011");
    }
    if (takenSet.has("COMP2012")) {
      progress.trackRequired.compCore.regularPath.comp2012.clear();
      used.add("COMP2012");
    }
  }

  const remainingPool = uniqueCourses.filter((course) => !used.has(course));
  const slots = [];

  for (let i = 0; i < progress.electives.mathListedNeed; i += 1) {
    slots.push({
      key: "mathListedNeed",
      predicate: (course) => req.electivePools.mathListed.has(course),
    });
  }

  for (let i = 0; i < progress.electives.math3000PlusNeed; i += 1) {
    slots.push({
      key: "math3000PlusNeed",
      predicate: (course) => isSubjectLevel(course, "MATH", 3000),
    });
  }

  for (let i = 0; i < progress.electives.compListedNeed; i += 1) {
    slots.push({
      key: "compListedNeed",
      predicate: (course) => req.electivePools.compListed.has(course),
    });
  }

  for (let i = 0; i < progress.electives.comp4000PlusNeed; i += 1) {
    slots.push({
      key: "comp4000PlusNeed",
      predicate: (course) => isSubjectLevel(course, "COMP", 4000),
    });
  }

  for (let i = 0; i < progress.electives.comp2000PlusNeed; i += 1) {
    slots.push({
      key: "comp2000PlusNeed",
      predicate: (course) => isSubjectLevel(course, "COMP", 2000),
    });
  }

  const slotToCourse = matchElectiveSlots(remainingPool, slots);

  for (let i = 0; i < slotToCourse.length; i += 1) {
    if (slotToCourse[i] !== -1) {
      progress.electives[slots[i].key] -= 1;
    }
  }

  return progress;
};

const evalPhysicsMajor = (courses, req) => {
  const progress = {
    prereq: structuredClone(req.prereq),
    required: structuredClone(req.required),
    groupedNeeds: structuredClone(req.groupedNeeds),
  };

  const uniqueCourses = normalizeUniqueCourses(courses);
  const takenSet = new Set(uniqueCourses);

  for (const key of Object.keys(progress.prereq)) {
    const taken = pickTaken(req.prereq[key], takenSet);
    if (taken) {
      progress.prereq[key].clear();
    }
  }

  if (takenSet.has("MATH1020")) {
    progress.required.calcI.clear();
    progress.required.calcII.clear();
    progress.required.acceleratedCalc.clear();
  } else {
    const calcI = pickTaken(req.required.calcI, takenSet);
    const calcII = pickTaken(req.required.calcII, takenSet);

    if (calcI) progress.required.calcI.clear();
    if (calcII) progress.required.calcII.clear();
  }

  for (const key of [
    "physLabI",
    "physLabII",
    "modernPhysics",
    "modernPhysicsLab",
    "seminarI",
    "mathMethodsI",
    "classicalMechanics",
    "emI",
    "qmI",
    "computationalMethods",
    "experimentalMethodsI",
    "experimentalMethodsII",
    "thermoStat",
    "seminarII",
    "capstone",
    "multivar",
    "linear",
    "lang",
  ]) {
    const taken = pickTaken(req.required[key], takenSet);
    if (taken) {
      progress.required[key].clear();
    }
  }

  const contemporaryApplicationsTaken = uniqueCourses.filter((course) =>
    req.groupedPools.contemporaryApplications.has(course),
  ).length;

  progress.groupedNeeds.contemporaryApplicationsNeed = Math.max(
    req.groupedNeeds.contemporaryApplicationsNeed - contemporaryApplicationsTaken,
    0,
  );

  return progress;
};

const evalChemistryMajor = (courses, req) => {
  const progress = {
    prereq: structuredClone(req.prereq),
    required: structuredClone(req.required),
    electiveNeeds: structuredClone(req.electiveNeeds),
    capstoneDirectDone: false,
    capstoneIreCount: 0,
  };

  const uniqueCourses = normalizeUniqueCourses(courses);
  const takenSet = new Set(uniqueCourses);
  const used = new Set();

  for (const key of Object.keys(progress.prereq)) {
    const taken = pickTaken(req.prereq[key], takenSet);
    if (taken) {
      progress.prereq[key].clear();
      used.add(taken);
    }
  }

  for (const key of Object.keys(progress.required)) {
    const taken = pickTaken(req.required[key], takenSet);
    if (taken) {
      progress.required[key].clear();
      used.add(taken);
    }
  }

  const capstoneDirect = pickTaken(req.groupedOptions.capstoneDirect, takenSet);
  if (capstoneDirect) {
    progress.capstoneDirectDone = true;
    used.add(capstoneDirect);
  } else {
    progress.capstoneIreCount = uniqueCourses.filter((course) =>
      req.groupedOptions.capstoneIre.has(course),
    ).length;

    for (const course of uniqueCourses) {
      if (req.groupedOptions.capstoneIre.has(course)) {
        used.add(course);
      }
    }
  }

  const remainingPool = uniqueCourses.filter((course) => !used.has(course));

  for (const course of remainingPool) {
    if (
      progress.electiveNeeds.chem3000PlusNeed > 0 &&
      isSubjectLevel(course, "CHEM", 3000)
    ) {
      progress.electiveNeeds.chem3000PlusNeed -= 1;
      continue;
    }

    if (
      progress.electiveNeeds.science2000PlusNeed > 0 &&
      req.scienceSubjects.some((subject) => isSubjectLevel(course, subject, 2000))
    ) {
      progress.electiveNeeds.science2000PlusNeed -= 1;
    }
  }

  return progress;
};

const electiveCreditsForCourse = (course, rule) => {
  for (const subrule of rule.rules) {
    if (subrule.type === "course-map" && subrule.courses[course] != null) {
      return subrule.courses[course];
    }

    if (
      subrule.type === "subject-level" &&
      isSubjectLevel(course, subrule.subject, subrule.minLevel)
    ) {
      return subrule.courses?.[course] ?? subrule.defaultCredits ?? 0;
    }
  }

  return 0;
};

const evaluateLifeSciencePath = (courses, req, path, usedCourses) => {
  const takenSet = new Set(courses);
  const missingGroups = [];
  const capstoneUsed = new Set();
  let startedGroups = 0;

  for (const group of path.groups) {
    const taken = pickTaken(group.options, takenSet);

    if (taken) {
      capstoneUsed.add(taken);
      startedGroups += 1;
    } else {
      missingGroups.push(group);
    }
  }

  const remainingElectivePool = courses.filter(
    (course) => !usedCourses.has(course) && !capstoneUsed.has(course),
  );
  const earnedElectiveCredits = remainingElectivePool.reduce(
    (total, course) => total + electiveCreditsForCourse(course, req.electiveRule),
    0,
  );

  return {
    path,
    missingGroups,
    capstoneUsed,
    startedGroups,
    earnedElectiveCredits,
    remainingElectiveCredits: Math.max(
      path.electiveCreditsRequired - earnedElectiveCredits,
      0,
    ),
  };
};

const chooseBestLifeSciencePath = (pathEvaluations) =>
  [...pathEvaluations].sort((a, b) => {
    if (a.missingGroups.length !== b.missingGroups.length) {
      return a.missingGroups.length - b.missingGroups.length;
    }

    if (a.startedGroups !== b.startedGroups) {
      return b.startedGroups - a.startedGroups;
    }

    return a.remainingElectiveCredits - b.remainingElectiveCredits;
  })[0];

const evalLifeScienceMajor = (courses, req) => {
  const progress = {
    prereq: structuredClone(req.prereq),
    required: structuredClone(req.required),
    pathEvaluations: [],
    selectedPath: null,
  };

  const uniqueCourses = normalizeUniqueCourses(courses);
  const takenSet = new Set(uniqueCourses);
  const used = new Set();

  for (const [key, config] of Object.entries(req.prereq)) {
    const taken = pickTaken(config.options, takenSet);
    if (taken) {
      progress.prereq[key].options.clear();
      used.add(taken);
    }
  }

  for (const [key, config] of Object.entries(req.required)) {
    const taken = pickTaken(config.options, takenSet);
    if (taken) {
      progress.required[key].options.clear();
      used.add(taken);
    }
  }

  progress.pathEvaluations = req.completionPaths.map((path) =>
    evaluateLifeSciencePath(uniqueCourses, req, path, used),
  );
  progress.selectedPath = chooseBestLifeSciencePath(progress.pathEvaluations);

  return progress;
};

const evalSchool = (courses, SREQ) => {
  const progress = structuredClone(SREQ);
  const uniqueCourses = normalizeUniqueCourses(courses);

  for (const course of uniqueCourses) {
    if (progress.COMP.size !== 0 && progress.COMP.has(course)) {
      progress.COMP.clear();
    }

    if (progress.LANG.size !== 0 && progress.LANG.has(course)) {
      progress.LANG.clear();
    }

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

    if (progress.LABS.size !== 0 && progress.LABS.has(course)) {
      progress.LABS.clear();
    }
  }

  return progress;
};

const COMMON_CORE_BUCKET_ORDER = ["hmw", "eComm", "cComm", "A", "H", "T", "SA"];

const COMMON_CORE_BUCKET_LABELS = {
  hmw: "Common core: Habits, Mindsets, and Wellness",
  eComm: "Common core: English Communication",
  cComm: "Common core: Chinese Communication",
  A: "Common core: Arts",
  H: "Common core: Humanities",
  T: "Common core: Technology",
  SA: "Common core: Social Analysis",
};

const normalizeCommonCoreCourse = (course, req) => {
  let normalized = course.trim().toUpperCase();

  if (/^CORE\d{4}[A-Z]$/.test(normalized)) {
    normalized = normalized.slice(0, 8);
  }

  return req.legacyAliases[normalized] ?? normalized;
};

const buildCommonCoreAvailableOptions = (req, bucket, takenCourses) =>
  Object.entries(req.courseCatalog)
    .filter(
      ([course, info]) =>
        info.buckets.includes(bucket) && !takenCourses.has(course),
    )
    .map(([course]) => course)
    .sort();

const evalCommonCore = (courses, req) => {
  const required = COMMON_CORE_BUCKET_ORDER.map(
    (bucket) => req.requiredCredits[bucket] ?? 0,
  );

  const takenCourses = new Set(
    normalizeUniqueCourses(
      courses.map((course) => normalizeCommonCoreCourse(course, req)),
    ),
  );

  const eligibleCourses = [...takenCourses]
    .filter((course) => req.courseCatalog[course])
    .map((course) => ({
      code: course,
      credits: req.courseCatalog[course].credits,
      buckets: req.courseCatalog[course].buckets.filter((bucket) =>
        COMMON_CORE_BUCKET_ORDER.includes(bucket),
      ),
    }))
    .filter((course) => course.buckets.length > 0);

  let states = new Map();
  states.set("0|0|0|0|0|0|0", {
    earned: Array(COMMON_CORE_BUCKET_ORDER.length).fill(0),
    score: 0,
    assignments: {},
  });

  for (const course of eligibleCourses) {
    const nextStates = new Map(states);

    for (const state of states.values()) {
      for (const bucket of course.buckets) {
        const bucketIndex = COMMON_CORE_BUCKET_ORDER.indexOf(bucket);
        const nextEarned = [...state.earned];

        nextEarned[bucketIndex] = Math.min(
          required[bucketIndex],
          nextEarned[bucketIndex] + course.credits,
        );

        const key = nextEarned.join("|");
        const score = sum(nextEarned);
        const existing = nextStates.get(key);

        if (!existing || score > existing.score) {
          nextStates.set(key, {
            earned: nextEarned,
            score,
            assignments: {
              ...state.assignments,
              [bucket]: [...(state.assignments[bucket] ?? []), course.code],
            },
          });
        }
      }
    }

    states = nextStates;
  }

  let bestState = null;

  for (const state of states.values()) {
    if (!bestState || state.score > bestState.score) {
      bestState = state;
    }
  }

  const earnedCredits = Object.fromEntries(
    COMMON_CORE_BUCKET_ORDER.map((bucket, index) => [
      bucket,
      bestState?.earned[index] ?? 0,
    ]),
  );

  const assignments = Object.fromEntries(
    COMMON_CORE_BUCKET_ORDER.map((bucket) => [
      bucket,
      bestState?.assignments[bucket] ?? [],
    ]),
  );

  return {
    earnedCredits,
    assignments,
    takenCourses,
    requiredCredits: req.requiredCredits,
  };
};

const commonCoreCategoriesFromProgress = (progress, req) => {
  const categories = [];

  for (const bucket of COMMON_CORE_BUCKET_ORDER) {
    const requiredCredits = req.requiredCredits[bucket] ?? 0;
    const earnedCredits = progress.earnedCredits[bucket] ?? 0;
    const remainingCredits = Math.max(requiredCredits - earnedCredits, 0);

    if (remainingCredits === 0) continue;

    const countedCourses = progress.assignments[bucket] ?? [];

    categories.push({
      id: `commonCore.${bucket}`,
      label: COMMON_CORE_BUCKET_LABELS[bucket],
      kind: "course-options",
      remainingCount: remainingCredits,
      options: buildCommonCoreAvailableOptions(
        req,
        bucket,
        progress.takenCourses,
      ),
      rule: `Need ${requiredCredits} credit(s) in this common core area.`,
      note:
        countedCourses.length > 0
          ? `Counted so far: ${earnedCredits}/${requiredCredits} credits via ${countedCourses.join(", ")}.`
          : `Counted so far: ${earnedCredits}/${requiredCredits} credits.`,
    });
  }

  return categories;
};

const majorCategoriesFromProgress = (progress, req) => {
  const categories = [];

  if (progress.prereq.regularPath.calcI.size > 0) {
    categories.push({
      id: "major.prereq.calcI",
      label: "Prerequisite: Calculus I",
      kind: "course-options",
      remainingCount: 1,
      options: setToSortedArray(progress.prereq.regularPath.calcI),
    });
  }

  if (progress.prereq.regularPath.calcII.size > 0) {
    categories.push({
      id: "major.prereq.calcII",
      label: "Prerequisite: Calculus II",
      kind: "course-options",
      remainingCount: 1,
      options: setToSortedArray(progress.prereq.regularPath.calcII),
    });
  }

  const coreLabels = {
    multivar: "Core: Multivariable calculus",
    analysis: "Core: Analysis",
    linear: "Core: Linear algebra",
    real: "Core: Real analysis",
    lang: "Core: Advanced language course",
  };

  for (const [key, label] of Object.entries(coreLabels)) {
    if (progress.core[key].size > 0) {
      categories.push({
        id: `major.core.${key}`,
        label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.core[key]),
      });
    }
  }

  const trackLabels = {
    discrete: "Track required: Discrete mathematics",
    abstractAlgebra: "Track required: Abstract algebra",
    capstone: "Track required: Capstone",
    compOrg: "Track required: Computer organization",
    algo: "Track required: Algorithms",
  };

  for (const [key, label] of Object.entries(trackLabels)) {
    if (progress.trackRequired[key].size > 0) {
      categories.push({
        id: `major.track.${key}`,
        label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.trackRequired[key]),
      });
    }
  }

  const missingComp2011 =
    progress.trackRequired.compCore.regularPath.comp2011.size > 0;
  const missingComp2012 =
    progress.trackRequired.compCore.regularPath.comp2012.size > 0;

  if (missingComp2011 || missingComp2012) {
    categories.push({
      id: "major.track.compCore",
      label: "Track required: COMP programming core",
      kind: "course-options",
      remainingCount: Number(missingComp2011) + Number(missingComp2012),
      options: [
        ...setToSortedArray(
          progress.trackRequired.compCore.regularPath.comp2011,
        ),
        ...setToSortedArray(
          progress.trackRequired.compCore.regularPath.comp2012,
        ),
      ],
      note: "COMP2012H also satisfies the alternative honors path.",
    });
  }

  const electiveRules = [
    {
      id: "major.elective.mathListed",
      label: "Math listed electives",
      remainingCount: progress.electives.mathListedNeed,
      options: setToSortedArray(req.electivePools.mathListed),
    },
    {
      id: "major.elective.math3000Plus",
      label: "MATH electives at 3000-level or above",
      remainingCount: progress.electives.math3000PlusNeed,
      rule: "Any MATH course numbered 3000 or above.",
    },
    {
      id: "major.elective.compListed",
      label: "COMP listed electives",
      remainingCount: progress.electives.compListedNeed,
      options: setToSortedArray(req.electivePools.compListed),
    },
    {
      id: "major.elective.comp4000Plus",
      label: "COMP electives at 4000-level or above",
      remainingCount: progress.electives.comp4000PlusNeed,
      rule: "Any COMP course numbered 4000 or above.",
    },
    {
      id: "major.elective.comp2000Plus",
      label: "Additional COMP elective at 2000-level or above",
      remainingCount: progress.electives.comp2000PlusNeed,
      rule: "Needed only when the COMP2012H honors path is used for the programming core.",
    },
  ];

  for (const rule of electiveRules) {
    if (rule.remainingCount > 0) {
      categories.push({
        id: rule.id,
        label: rule.label,
        kind: "count-only",
        remainingCount: rule.remainingCount,
        options: rule.options,
        rule: rule.rule,
      });
    }
  }

  return categories;
};

const physicsMajorCategoriesFromProgress = (progress, req) => {
  const categories = [];

  const prereqLabels = {
    physicsI: "Prerequisite: Physics I",
    physicsII: "Prerequisite: Physics II",
  };

  for (const [key, label] of Object.entries(prereqLabels)) {
    if (progress.prereq[key].size > 0) {
      categories.push({
        id: `major.prereq.${key}`,
        label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.prereq[key]),
      });
    }
  }

  if (
    progress.required.acceleratedCalc.size > 0 &&
    (progress.required.calcI.size > 0 || progress.required.calcII.size > 0)
  ) {
    if (progress.required.calcI.size > 0) {
      categories.push({
        id: "major.required.calcI",
        label: "Required: Calculus I",
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.required.calcI),
      });
    }

    if (progress.required.calcII.size > 0) {
      categories.push({
        id: "major.required.calcII",
        label: "Required: Calculus II",
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.required.calcII),
      });
    }

    categories.push({
      id: "major.required.acceleratedCalc",
      label: "Alternative required: Accelerated calculus",
      kind: "course-options",
      remainingCount: 1,
      options: setToSortedArray(progress.required.acceleratedCalc),
      note: "MATH1020 satisfies both the Calculus I and Calculus II requirements.",
    });
  }

  const requiredLabels = {
    physLabI: "Required: Physics lab I",
    physLabII: "Required: Physics lab II",
    modernPhysics: "Required: Modern physics",
    modernPhysicsLab: "Required: Modern physics laboratory",
    seminarI: "Required: Physics seminar and tutorial I",
    mathMethodsI: "Required: Mathematical methods in physics I",
    classicalMechanics: "Required: Classical mechanics",
    emI: "Required: Electricity and magnetism I",
    qmI: "Required: Quantum mechanics I",
    computationalMethods: "Required: Computational methods in physics",
    experimentalMethodsI: "Required: Methods of experimental physics I",
    experimentalMethodsII: "Required: Methods of experimental physics II",
    thermoStat: "Required: Thermodynamics and statistical physics",
    seminarII: "Required: Physics seminar and tutorial II",
    capstone: "Required: Physics capstone",
    multivar: "Required: Multivariable calculus",
    linear: "Required: Linear algebra",
    lang: "Required: Advanced language course",
  };

  for (const [key, label] of Object.entries(requiredLabels)) {
    if (progress.required[key].size > 0) {
      categories.push({
        id: `major.required.${key}`,
        label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.required[key]),
      });
    }
  }

  if (progress.groupedNeeds.contemporaryApplicationsNeed > 0) {
    categories.push({
      id: "major.grouped.contemporaryApplications",
      label: "Required: Contemporary applications of physics",
      kind: "course-options",
      remainingCount: progress.groupedNeeds.contemporaryApplicationsNeed,
      options: setToSortedArray(req.groupedPools.contemporaryApplications),
      rule: "Take any 2 courses from PHYS4811, PHYS4812, PHYS4813, and PHYS4814.",
    });
  }

  return categories;
};

const chemistryMajorCategoriesFromProgress = (progress) => {
  const categories = [];

  const prereqLabels = {
    chemI: "Prerequisite: General Chemistry I",
    chemII: "Prerequisite: General Chemistry II",
  };

  for (const [key, label] of Object.entries(prereqLabels)) {
    if (progress.prereq[key].size > 0) {
      categories.push({
        id: `major.prereq.${key}`,
        label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.prereq[key]),
      });
    }
  }

  const requiredLabels = {
    chemLabI: "Required: Laboratory for General Chemistry I",
    chemLabII: "Required: Laboratory for General Chemistry II",
    organicI: "Required: Organic Chemistry I",
    inorganicI: "Required: Inorganic Chemistry I",
    analytical: "Required: Fundamentals of Analytical Chemistry",
    mathMethods: "Required: Mathematical Methods for Physical Chemistry",
    physicalI: "Required: Physical Chemistry I",
    synthLabI: "Required: Synthetic Chemistry Laboratory I",
    characterizationLabI:
      "Required: Molecular Characterization Chemistry Laboratory I",
    organicII: "Required: Organic Chemistry II",
    inorganicII: "Required: Inorganic Chemistry II",
    instrumental: "Required: Instrumental Analysis",
    physicalII: "Required: Physical Chemistry II",
    synthLabII: "Required: Synthetic Chemistry Laboratory II",
    characterizationLabII:
      "Required: Molecular Characterization Chemistry Laboratory II",
    calculus: "Required: Calculus",
    lang: "Required: Science Communication in English",
  };

  for (const [key, label] of Object.entries(requiredLabels)) {
    if (progress.required[key].size > 0) {
      categories.push({
        id: `major.required.${key}`,
        label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(progress.required[key]),
      });
    }
  }

  if (!progress.capstoneDirectDone && progress.capstoneIreCount < 2) {
    categories.push({
      id: "major.grouped.capstone",
      label: "Required: Chemistry capstone or IRE project sequence",
      kind: "course-options",
      remainingCount: progress.capstoneIreCount > 0 ? 1 : 2,
      options: ["CHEM4689", "CHEM4691", "SCIE3500", "SCIE4500"],
      rule: "Take CHEM4689 or CHEM4691, or take both SCIE3500 and SCIE4500.",
      note:
        progress.capstoneIreCount > 0
          ? `IRE path progress: ${progress.capstoneIreCount}/2 courses completed.`
          : undefined,
    });
  }

  if (progress.electiveNeeds.chem3000PlusNeed > 0) {
    categories.push({
      id: "major.elective.chem3000Plus",
      label: "CHEM elective at 3000-level or above",
      kind: "count-only",
      remainingCount: progress.electiveNeeds.chem3000PlusNeed,
      rule: "Any CHEM course numbered 3000 or above. Chemistry Option and IRE Track students are exempt from this requirement.",
    });
  }

  if (progress.electiveNeeds.science2000PlusNeed > 0) {
    categories.push({
      id: "major.elective.science2000Plus",
      label: "Science elective at 2000-level or above",
      kind: "count-only",
      remainingCount: progress.electiveNeeds.science2000PlusNeed,
      rule: "Any School of Science course numbered 2000 or above. The source requirement is 2 credits minimum.",
    });
  }

  return categories;
};

const lifeScienceMajorCategoriesFromProgress = (progress, req) => {
  const categories = [];

  for (const [key, config] of Object.entries(progress.prereq)) {
    if (config.options.size > 0) {
      categories.push({
        id: `major.prereq.${key}`,
        label: req.prereq[key].label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(config.options),
      });
    }
  }

  for (const [key, config] of Object.entries(progress.required)) {
    if (config.options.size > 0) {
      categories.push({
        id: `major.required.${key}`,
        label: req.required[key].label,
        kind: "course-options",
        remainingCount: 1,
        options: setToSortedArray(config.options),
      });
    }
  }

  const selectedPath = progress.selectedPath;

  if (selectedPath?.missingGroups.length > 0) {
    categories.push({
      id: "major.grouped.capstone",
      label: `Required: ${selectedPath.path.label}`,
      kind: "course-options",
      remainingCount: selectedPath.missingGroups.length,
      options: selectedPath.missingGroups.flatMap((group) =>
        setToSortedArray(group.options),
      ),
      rule: selectedPath.missingGroups
        .map(
          (group) =>
            `${group.label}: ${setToSortedArray(group.options).join(" or ")}`,
        )
        .join(". "),
      note:
        progress.pathEvaluations.length > 1
          ? `Evaluator selected the ${selectedPath.path.label.toLowerCase()} path based on your current transcript progress.`
          : undefined,
    });
  }

  if (selectedPath && selectedPath.remainingElectiveCredits > 0) {
    categories.push({
      id: "major.elective.lifeScience",
      label: req.electiveRule.label,
      kind: "count-only",
      remainingCount: selectedPath.remainingElectiveCredits,
      rule: req.electiveRule.note,
      note: `${selectedPath.earnedElectiveCredits}/${selectedPath.path.electiveCreditsRequired} elective credit(s) counted for the selected ${selectedPath.path.label.toLowerCase()} path.`,
    });
  }

  return categories;
};

const schoolCategoriesFromProgress = (progress) => {
  const categories = [];

  if (progress.COMP.size > 0) {
    categories.push({
      id: "school.comp",
      label: "School common COMP requirement",
      kind: "course-options",
      remainingCount: 1,
      options: setToSortedArray(progress.COMP),
    });
  }

  if (progress.LANG.size > 0) {
    categories.push({
      id: "school.lang",
      label: "School common LANG requirement",
      kind: "course-options",
      remainingCount: 1,
      options: setToSortedArray(progress.LANG),
    });
  }

  if (progress.lecNeed > 0) {
    const disciplineSummary = Object.entries(progress.lecCount)
      .map(
        ([discipline, count]) => `${discipline}: ${count}/${progress.lecCap}`,
      )
      .join(", ");

    categories.push({
      id: "school.foundationLectures",
      label: "Science foundation lecture courses",
      kind: "count-only",
      remainingCount: progress.lecNeed,
      rule: "Take eligible CHEM, LIFS, MATH, or PHYS lecture courses, with at most 3 counted from each discipline.",
      note: `Current counted lectures by discipline: ${disciplineSummary}.`,
    });
  }

  if (progress.LABS.size > 0) {
    categories.push({
      id: "school.foundationLab",
      label: "Science foundation lab course",
      kind: "course-options",
      remainingCount: 1,
      options: setToSortedArray(progress.LABS),
    });
  }

  return categories;
};

const buildRecommendations = (categories) =>
  categories.map((category) => ({
    id: category.id,
    label: category.label,
    remainingCount: category.remainingCount,
    options: category.options ?? [],
    rule: category.rule,
    note: category.note,
  }));

function evalRem({ courses, admitTerm, school, major }) {
  const reqYear = admitTerm.slice(0, -1);
  const schoolCatalog = getSchoolCatalog(reqYear, school);

  if (!schoolCatalog) {
    throw new Error(
      `Remaining-requirement evaluation is currently not implemented for school '${school}' in '${reqYear}'.`,
    );
  }

  const programCatalog = getProgramCatalog({ reqYear, school, major });

  if (!programCatalog) {
    throw new Error(
      `Remaining-requirement evaluation is currently not implemented for major '${major}'.`,
    );
  }

  const schoolReq = require(
    `../requirements/${reqYear}/${school}/${schoolCatalog.files.school}`,
  );
  const commonCoreReq = require(
    `../requirements/${reqYear}/${school}/${schoolCatalog.files.commonCore}`,
  );
  const majorReq = require(
    `../requirements/${reqYear}/${school}/${programCatalog.requirementFile}`,
  );

  const schoolProgress = evalSchool(courses, schoolReq);
  const commonCoreProgress = evalCommonCore(courses, commonCoreReq);
  const majorEvaluators = {
    "math-cs": {
      evaluate: evalMajor,
      buildCategories: majorCategoriesFromProgress,
    },
    physics: {
      evaluate: evalPhysicsMajor,
      buildCategories: physicsMajorCategoriesFromProgress,
    },
    chemistry: {
      evaluate: evalChemistryMajor,
      buildCategories: chemistryMajorCategoriesFromProgress,
    },
    "life-science": {
      evaluate: evalLifeScienceMajor,
      buildCategories: lifeScienceMajorCategoriesFromProgress,
    },
  };
  const majorEvaluator = majorEvaluators[programCatalog.evaluator];

  if (!majorEvaluator) {
    throw new Error(
      `No evaluator registered for '${programCatalog.evaluator}'.`,
    );
  }

  const majorProgress = majorEvaluator.evaluate(courses, majorReq);

  const schoolCategories = schoolCategoriesFromProgress(schoolProgress);
  const commonCoreCategories = commonCoreCategoriesFromProgress(
    commonCoreProgress,
    commonCoreReq,
  );
  const majorCategories = majorEvaluator.buildCategories(majorProgress, majorReq);
  const categories = [
    ...schoolCategories,
    ...commonCoreCategories,
    ...majorCategories,
  ];

  return {
    summary: {
      remainingBucketCount: categories.length,
      totalRemainingCourseCount: categories.reduce(
        (total, category) => total + category.remainingCount,
        0,
      ),
    },
    remaining: {
      school: schoolCategories,
      commonCore: commonCoreCategories,
      major: majorCategories,
    },
    recommendations: buildRecommendations(categories),
  };
}

module.exports = evalRem;
