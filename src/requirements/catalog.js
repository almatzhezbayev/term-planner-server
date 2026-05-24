const SCIENCE_MAJOR_MATCHERS = [
  { majorId: "math-pma", pattern: "Pure Mathematics (Advanced)" },
  { majorId: "math-pm", pattern: "Pure Mathematics" },
  { majorId: "math-am", pattern: "Applied Mathematics" },
  { majorId: "math-s", pattern: "Statistics" },
  { majorId: "math-fam", pattern: "Financial and Actuarial Mathematics" },
  { majorId: "math-cs", pattern: "Computer Science" },
  { majorId: "math-gm", pattern: "General Mathematics" },
  { majorId: "phys", pattern: "Physics" },
  { majorId: "chem", pattern: "Chemistry" },
  { majorId: "bisc", pattern: "Biological Science" },
  { majorId: "biot", pattern: "Biotechnology" },
  { majorId: "bcb", pattern: "Biochemistry and Cell Biology" },
];

const REQUIREMENT_CATALOG = {
  "22-23": {
    science: {
      files: {
        school: "SREQ",
        commonCore: "cc_sci",
      },
      parserMajors: SCIENCE_MAJOR_MATCHERS,
      programs: {
        "math-cs": {
          requirementFile: "math",
          evaluator: "math-cs",
        },
        phys: {
          requirementFile: "physics",
          evaluator: "physics",
        },
        chem: {
          requirementFile: "chemistry",
          evaluator: "chemistry",
        },
        bisc: {
          requirementFile: "bisc",
          evaluator: "life-science",
        },
        biot: {
          requirementFile: "biot",
          evaluator: "life-science",
        },
        bcb: {
          requirementFile: "bcb",
          evaluator: "life-science",
        },
      },
    },
  },
  "23-24": {
    science: {
      files: {
        school: "SREQ",
        commonCore: "cc_sci",
      },
      parserMajors: SCIENCE_MAJOR_MATCHERS,
      programs: {
        "math-cs": {
          requirementFile: "math",
          evaluator: "math-cs",
        },
      },
    },
  },
};

const getSchoolCatalog = (reqYear, school) => REQUIREMENT_CATALOG[reqYear]?.[school];

const detectMajorFromCatalog = ({ reqYear, school, majorText }) => {
  const schoolCatalog = getSchoolCatalog(reqYear, school);

  if (!schoolCatalog) return null;

  const matched = schoolCatalog.parserMajors.find(({ pattern }) =>
    majorText.includes(pattern),
  );

  return matched?.majorId ?? null;
};

const getProgramCatalog = ({ reqYear, school, major }) =>
  getSchoolCatalog(reqYear, school)?.programs?.[major] ?? null;

module.exports = {
  REQUIREMENT_CATALOG,
  getSchoolCatalog,
  detectMajorFromCatalog,
  getProgramCatalog,
};
