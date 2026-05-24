// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202223/pdf/22-23biot.pdf
const BIOT = {
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
    cellBiology: {
      label: "Required: Cell biology",
      options: new Set(["LIFS2710"]),
    },
    biotechIndustry: {
      label: "Required: Introduction to biotechnology industry",
      options: new Set(["LIFS2740"]),
    },
    bioprocess: {
      label: "Required: Concepts in bioprocessing",
      options: new Set(["LIFS3110"]),
    },
    advancedBiotech: {
      label: "Required: Advanced biotechnology",
      options: new Set(["LIFS3630"]),
    },
    bioinfo: {
      label: "Required: Introduction to bioinformatics",
      options: new Set(["LIFS4090"]),
    },
    ethics: {
      label: "Required: Bioethics and business",
      options: new Set(["LIFS4250"]),
    },
    language: {
      label: "Required: Advanced language course",
      options: new Set(["LANG3024", "LANG3027"]),
    },
  },

  completionPaths: [
    {
      id: "directCapstone",
      label: "Biotechnology capstone",
      groups: [
        {
          label: "Capstone",
          options: new Set(["LIFS4963"]),
        },
      ],
      electiveCreditsRequired: 18,
    },
    {
      id: "projectResearch",
      label: "Biotechnology project sequence",
      groups: [
        {
          label: "Project I",
          options: new Set(["LIFS4973"]),
        },
        {
          label: "Project II",
          options: new Set(["LIFS4983"]),
        },
      ],
      electiveCreditsRequired: 18,
    },
    {
      id: "irePath",
      label: "Biotechnology IRE sequence",
      groups: [
        {
          label: "IRE project",
          options: new Set(["SCIE4500"]),
        },
        {
          label: "Project II",
          options: new Set(["LIFS4983"]),
        },
      ],
      electiveCreditsRequired: 15,
    },
  ],

  electiveRule: {
    label: "Biotechnology electives",
    note: "Need at least 18 credits, or 15 credits for the IRE path, from the approved biotechnology elective pool.",
    rules: [
      {
        type: "course-map",
        courses: {
          BIPH3000: 3,
          BIPH3500: 3,
          BIPH3900: 3,
          BIPH4100: 3,
          CHEM2110: 4,
          CHEM2210: 4,
          CHEM2310: 4,
          CHEM2410: 4,
          CHEM3120: 4,
          CHEM3220: 4,
          CHEM3320: 4,
          CHEM3420: 4,
          CENG4030: 3,
          CENG4120: 3,
          CENG4140: 3,
          CENG4150: 3,
          CIVL4020: 3,
          COMP3211: 3,
          ELEC4010: 3,
          ELEC4130: 3,
          ELEC4140: 4,
          ENVS3200: 3,
          IEDA3300: 3,
          ISOM3230: 3,
          LIFS3002: 2,
          LIFS3003: 3,
          LIFS3005: 3,
          LIFS3010: 3,
          LIFS3030: 3,
          LIFS3040: 3,
          LIFS3050: 3,
          LIFS3070: 3,
          LIFS3100: 3,
          LIFS3120: 3,
          LIFS3130: 3,
          LIFS3140: 4,
          LIFS3150: 3,
          LIFS3160: 3,
          LIFS3200: 3,
          LIFS3210: 4,
          LIFS3220: 4,
          LIFS3230: 3,
          LIFS3240: 3,
          LIFS3250: 3,
          LIFS3260: 4,
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
          MECH2210: 3,
          PHYS2022: 4,
          PHYS3033: 4,
        },
      },
    ],
  },
};

module.exports = BIOT;
