// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202324/pdf/23-24math.pdf
const MATH_CS = {
  prereq: {
    regularPath: {
      calcI: new Set(["MATH1012", "MATH1013", "MATH1023"]),
      calcII: new Set(["MATH1014", "MATH1024"]),
    },
    acceleratedPath: new Set(["MATH1020"]),
  },

  core: {
    multivar: new Set(["MATH2023"]),
    analysis: new Set(["MATH2033", "MATH2043"]),
    linear: new Set(["MATH2121", "MATH2131"]),
    real: new Set(["MATH3033", "MATH3043"]),
    lang: new Set(["LANG3021", "LANG3027"]),
  },

  trackRequired: {
    discrete: new Set(["MATH2343", "COMP2711", "COMP2711H"]),
    abstractAlgebra: new Set(["MATH3121"]),
    capstone: new Set(["MATH4991", "MATH4992", "MATH4999"]),

    // (COMP2011 AND COMP2012) OR COMP2012H
    compCore: {
      regularPath: {
        comp2011: new Set(["COMP2011"]),
        comp2012: new Set(["COMP2012"]),
      },
      honorsPath: new Set(["COMP2012H"]),
    },

    compOrg: new Set(["COMP2611"]),
    algo: new Set(["COMP3711", "COMP3711H"]),
  },

  electiveNeeds: {
    math3000PlusNeed: 1,
    mathListedNeed: 2,
    comp4000PlusNeed: 1,
    comp2000PlusNeed: 0, // becomes 1 only if COMP2012H path is used
    compListedNeed: 1,
  },

  electivePools: {
    mathListed: new Set([
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
    ]),
    compListed: new Set([
      "COMP3031",
      "COMP3111",
      "COMP3111H",
      "COMP3211",
      "COMP3311",
      "COMP3511",
    ]),
  },
};

module.exports = MATH_CS;
