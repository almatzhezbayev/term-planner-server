const math = {
  prereq: {
    type: "or",
    rules: [
      {
        type: "and",
        rules: [
          { courses: ["MATH1012", "MATH1013", "MATH1023"], count: 1 },
          { courses: ["MATH1014", "MATH1024"], count: 1 },
        ],
      },

      { courses: ["MATH1020"], count: 1 },
    ],
  },

  req: {
    type: "and",
    rules: [
      { courses: ["MATH2023"], count: 1 },
      { courses: ["MATH2033", "MATH2043"], count: 1 },
      { courses: ["MATH2121", "MATH2131"], count: 1 },
      { courses: ["MATH3033", "MATH3043"], count: 1 },
      { courses: ["LANG3021", "LANG3027"], count: 1 },
    ],
  },

  tracks: {
    "math-am": {
      req: {
        type: "and",
        rules: [
          { courses: ["MATH2352", "MATH2411", "MATH3312"], count: 3 },
          { courses: ["MATH4992", "MATH4999"], count: 1 },
          {
            courses: [
              "MATH2001",
              "MATH2421",
              "MATH2431",
              "MATH3322",
              "MATH3332",
              "MATH3425",
              "MATH4023",
              "MATH4051",
              "MATH4052",
              "MATH4321",
              "MATH4326",
              "MATH4333",
              "MATH4335",
              "MATH4336",
              "MATH4343",
              "MATH4351",
              "MATH4511",
              "MATH4512",
              "MATH4823",
            ],
            count: 4,
          },
        ],
      },
    },

    "math-cs": {
      req: {
        type: "and",
        rules: [
          { courses: ["MATH2343", "MATH3121", "COMP2611"], count: 3 },
          { courses: ["MATH4991", "MATH4992", "MATH4999"], count: 1 },
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
      },
    },

    "math-fam": {
      req: {
        type: "and",
        rules: [
          {
            courses: [
              "MATH2411",
              "MATH2511",
              "MATH3423",
              "MATH4427",
              "MATH4511",
              "MATH4512",
              "MATH4513",
              "MATH4514",
              "MATH4515",
            ],
            count: 9,
          },
          { courses: ["MATH2421", "MATH2431"], count: 1 },
          { courses: ["MATH4996", "MATH4999"], count: 1 },
          {
            courses: [
              "MATH2001",
              "MATH2352",
              "MATH3312",
              "MATH3343",
              "MATH4023",
              "MATH4052",
            ],
            count: 1,
          },
          {
            courses: [
              "MATH3424",
              "MATH3425",
              "MATH3426",
              "MATH3427",
              "MATH3428",
              "MATH4423",
              "MATH4424",
              "MATH4425",
              "MATH4426",
              "MATH4429",
              "MATH4432",
              "MATH4433",
            ],
            count: 2,
          },
        ],
      },
    },

    "math-gm": {
      req: {
        type: "and",
        rules: [
          {
            courses: ["MATH4991", "MATH4992", "MATH4993", "MATH4999"],
            count: 1,
          },
          {
            elec: {
              code: "MATH",
              lvl: 2000,
            },
            count: 3,
          },
          {
            elec: {
              code: "MATH",
              lvl: 3000,
            },
            count: 2,
          },
          {
            elec: {
              code: "MATH",
              lvl: 4000,
            },
            count: 2,
          },
        ],
      },
    },

    "math-p": {
      req: {
        type: "and",
        rules: [
          {
            courses: [
              "MATH2001",
              "MATH2352",
              "MATH3312",
              "MATH4023",
              "MATH4052",
              "PHYS1113",
              "PHYS1115",
              "PHYS2022",
              "PHYS2023",
              "PHYS3032",
              "PHYS4050",
            ],
            count: 10,
          },
          { courses: ["MATH4991", "MATH4992", "MATH4999"], count: 1 },
          { courses: ["PHYS1111", "PHYS1112", "PHYS1312"], count: 1 },
          { courses: ["PHYS1114", "PHYS1314"], count: 1 },
          { courses: ["PHYS3033", "PHYS3053"], count: 1 },
          { courses: ["PHYS3034", "PHYS4051", "PHYS4052"], count: 1 },
          { courses: ["PHYS3036", "PHYS3037"], count: 1 },
          {
            type: "or",
            rules: [
              {
                elec: {
                  code: "MATH",
                  lvl: 3000,
                },
                count: 1,
              },
              {
                elec: {
                  code: "PHYS",
                  lvl: 3000,
                },
                count: 1,
              },
            ],
          },
        ],
      },
    },

    "math-pm": {
      req: {
        type: "and",
        rules: [
          { courses: ["MATH2001", "MATH3131", "MATH4225"], count: 3 },
          { courses: ["MATH4991", "MATH4991"], count: 1 },
          {
            type: "and",
            rules: [
              {
                courses: [
                  "MATH4141",
                  "MATH4151",
                  "MATH4023",
                  "MATH4051",
                  "MATH4052",
                  "MATH4033",
                  "MATH4221",
                  "MATH4223",
                ],
                count: 4,
              },
              {
                courses: ["MATH4141", "MATH4151"],
                count: 1,
              },
              {
                courses: ["MATH4023", "MATH4051", "MATH4052"],
                count: 1,
              },
              {
                courses: ["MATH4033", "MATH4221", "MATH4223"],
                count: 1,
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
              "MATH2343",
              "MATH2352",
              "MATH2411",
              "MATH3312",
              "MATH3343",
              "MATH4321",
              "MATH4326",
              "MATH4343",
            ],
            count: 1,
          },
        ],
      },

      capstone: {
        courses: ["MATH4991", "MATH4999"],
        count: 1,
      },
    },

    "math-pma": {
      required: {
        courses: ["MATH2001", "MATH3131", "MATH4225"],
        count: 3,
      },

      capstone: {
        courses: ["MATH4991", "MATH4999"],
        count: 1,
      },

      depth: {
        courses: [
          "MATH4141",
          "MATH4151",
          "MATH4023",
          "MATH4051",
          "MATH4052",
          "MATH4033",
          "MATH4221",
          "MATH4223",
        ],
        count: 4,
      },
    },

    "math-stat": {
      required: {
        courses: [
          "MATH2411",
          "MATH3423",
          "MATH3424",
          "MATH3426",
          "MATH3427",
          "MATH3428",
        ],
        count: 6,
      },

      probability: {
        courses: ["MATH2421", "MATH2431"],
        count: 1,
      },

      advanced: {
        courses: ["MATH4424", "MATH4425"],
        count: 1,
      },

      capstone: {
        courses: ["MATH4993", "MATH4999"],
        count: 1,
      },
    },
  },
};

module.exports = math;
