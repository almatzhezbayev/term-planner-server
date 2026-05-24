// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202223/pdf/22-23bcb.pdf
const BCB = {
  prereq: {
    bioI: {
      label: "Prerequisite: General biology I",
      options: new Set(["LIFS1901"]),
    },
    bioII: {
      label: "Prerequisite: General biology II",
      options: new Set(["LIFS1902"]),
    },
    chemI: {
      label: "Prerequisite: General chemistry I",
      options: new Set(["CHEM1020"]),
    },
    chemII: {
      label: "Prerequisite: General chemistry II",
      options: new Set(["CHEM1030"]),
    },
  },

  required: {
    bioLabI: {
      label: "Required: General biology laboratory I",
      options: new Set(["LIFS1903"]),
    },
    bioLabII: {
      label: "Required: General biology laboratory II",
      options: new Set(["LIFS1904"]),
    },
    genetics: {
      label: "Required: Fundamentals of genetics",
      options: new Set(["LIFS2040"]),
    },
    biochemistry: {
      label: "Required: Basic biochemistry",
      options: new Set(["LIFS2100"]),
    },
    biochemistryLab: {
      label: "Required: Biochemistry laboratory",
      options: new Set(["LIFS3100"]),
    },
    molecularBiology: {
      label: "Required: Molecular biology",
      options: new Set(["LIFS3200"]),
    },
    cellBiology: {
      label: "Required: Cell biology",
      options: new Set(["LIFS3210"]),
    },
    developmentalBiology: {
      label: "Required: Developmental biology",
      options: new Set(["LIFS3220", "LIFS3260"]),
    },
    biologicalChemistry: {
      label: "Required: Biological chemistry",
      options: new Set(["CHEM2110", "CHEM2311"]),
    },
    analyticalChemLab: {
      label: "Required: Analytical chemistry laboratory",
      options: new Set(["CHEM2155", "CHEM2355"]),
    },
    language: {
      label: "Required: Advanced language course",
      options: new Set(["LANG3024", "LANG3027"]),
    },
  },

  completionPaths: [
    {
      id: "directCapstone",
      label: "Biochemistry and cell biology capstone",
      groups: [
        {
          label: "Capstone",
          options: new Set(["LIFS4961"]),
        },
      ],
      electiveCreditsRequired: 24,
    },
    {
      id: "projectResearch",
      label: "Biochemistry and cell biology project sequence",
      groups: [
        {
          label: "Project I",
          options: new Set(["LIFS4971"]),
        },
        {
          label: "Project II",
          options: new Set(["LIFS4981"]),
        },
      ],
      electiveCreditsRequired: 20,
    },
    {
      id: "irePath",
      label: "Biochemistry and cell biology IRE sequence",
      groups: [
        {
          label: "IRE project",
          options: new Set(["SCIE4500"]),
        },
        {
          label: "Project II",
          options: new Set(["LIFS4981"]),
        },
      ],
      electiveCreditsRequired: 12,
    },
  ],

  electiveRule: {
    label: "Biochemistry and cell biology electives",
    note: "Need at least 24 credits, or 20 credits for the project sequence, or 12 credits for the IRE path, from the approved BCB elective pool.",
    rules: [
      {
        type: "course-map",
        courses: {
          BIPH3000: 3,
          BIPH4100: 3,
          CHEM2110: 4,
          CHEM2155: 1,
          CHEM2210: 4,
          CHEM2310: 4,
          CHEM2311: 4,
          CHEM2355: 1,
          CHEM2410: 4,
          CHEM2550: 1,
          CHEM2555: 1,
          CHEM3120: 4,
          CHEM3220: 4,
          CHEM3320: 4,
          CHEM3420: 4,
          CHEM3550: 1,
          CHEM3555: 1,
          COMP3211: 3,
          LIFS3002: 2,
          LIFS3003: 3,
          LIFS3004: 4,
          LIFS3005: 3,
          LIFS3010: 3,
          LIFS3030: 3,
          LIFS3040: 3,
          LIFS3050: 3,
          LIFS3070: 3,
          LIFS3110: 3,
          LIFS3120: 3,
          LIFS3130: 3,
          LIFS3140: 4,
          LIFS3150: 3,
          LIFS3160: 3,
          LIFS3230: 3,
          LIFS3240: 3,
          LIFS3250: 3,
          LIFS3270: 3,
          LIFS3280: 4,
          LIFS3300: 3,
          LIFS3310: 3,
          LIFS3320: 3,
          LIFS3400: 4,
          LIFS3420: 2,
          LIFS3430: 3,
          LIFS3440: 3,
          LIFS3450: 4,
          LIFS3460: 2,
          LIFS3550: 3,
          LIFS4000: 3,
          LIFS4010: 3,
          LIFS4020: 3,
          LIFS4030: 3,
          LIFS4040: 3,
          LIFS4050: 3,
          LIFS4060: 3,
          LIFS4070: 3,
          LIFS4090: 3,
          LIFS4200: 3,
          LIFS4210: 3,
          LIFS4220: 3,
          LIFS4230: 3,
          LIFS4240: 3,
          LIFS4250: 3,
          LIFS4260: 3,
          LIFS4270: 3,
          LIFS4280: 3,
          LIFS4290: 3,
          MATH2033: 4,
        },
      },
    ],
  },
};

module.exports = BCB;
