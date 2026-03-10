const SREQ = {
  COMP: {
    courses: ["COMP1021", "COMP1022P", "COMP2011"],
    count: 1,
  },

  LANG: {
    courses: ["LANG2010"],
    count: 1,
  },

  foundations: {
    total: 8,

    lectures: {
      count: 7,
      discipline_limit: {
        min: 1,
        max: 3,
      },

      disciplines: {
        CHEM: ["CHEM1008", "CHEM1011", "CHEM1012"],
        LIFS: [
          "LIFS1901",
          "LIFS1902",
          "LIFS1930",
          "LIFS2210",
          "OCES1001",
          "OCES1010",
        ],
        MATH: [
          "DASC2010",
          "MATH1012",
          "MATH1013",
          "MATH1014",
          "MATH1020",
          "MATH1023",
          "MATH1024",
          "MATH2023",
          "MATH2121",
          "MATH2131",
        ],
        PHYS: [
          "PHYS1101",
          "PHYS1111",
          "PHYS1112",
          "PHYS1114",
          "PHYS1312",
          "PHYS1314",
        ],
      },
    },

    labs: {
      count: 1,
      courses: [
        "CHEM1051",
        "CHEM1052",
        "LIFS1903",
        "LIFS1904",
        "PHYS1113",
        "PHYS1115",
      ],
    },
  },

  IRE: {
    type: "and",
    rules: [
      { courses: ["SCIE1500", "SCIE2500", "SCIE3900"], count: 3 },

      {
        courses: ["SCIE2800", "SCIE3110", "SCIE3500", "SCIE4500", "SCIE4860"],
        count: 2,
      },

      {
        courses: ["UROP1000", "UROP1100"],
        count: 1,
      },
    ],
  },
};

module.exports = SREQ;
