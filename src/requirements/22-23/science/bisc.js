// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202223/pdf/22-23bisc.pdf
const BISC = {
  prereq: {
    bioI: {
      label: "Prerequisite: General biology I",
      options: new Set(["LIFS1901"]),
    },
    bioII: {
      label: "Prerequisite: General biology II",
      options: new Set(["LIFS1902"]),
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
    biostatistics: {
      label: "Required: Introduction to biostatistics",
      options: new Set(["LIFS3010"]),
    },
    ecology: {
      label: "Required: Fundamentals of ecology",
      options: new Set(["LIFS3040"]),
    },
    advancedLab: {
      label: "Required: Biological sciences laboratory",
      options: new Set(["LIFS3420", "LIFS3460"]),
    },
    language: {
      label: "Required: Advanced language course",
      options: new Set(["LANG3024", "LANG3027"]),
    },
  },

  completionPaths: [
    {
      id: "directCapstone",
      label: "Biological science capstone",
      groups: [
        {
          label: "Capstone",
          options: new Set(["LIFS4960"]),
        },
      ],
      electiveCreditsRequired: 12,
    },
    {
      id: "researchProject",
      label: "Biological science research sequence",
      groups: [
        {
          label: "Project I",
          options: new Set(["LIFS4970"]),
        },
        {
          label: "Project II",
          options: new Set(["LIFS4980"]),
        },
      ],
      electiveCreditsRequired: 12,
    },
  ],

  electiveRule: {
    label: "Biological science electives",
    note: "Need at least 12 credits from any LIFS course at 3000/4000-level, plus BIPH3000, ENVS3060, ENVS3220, LIFS2100, or OCES3010. Variable-credit LIFS electives are counted as 3 credits by default unless listed below.",
    rules: [
      {
        type: "subject-level",
        subject: "LIFS",
        minLevel: 3000,
        defaultCredits: 3,
      },
      {
        type: "course-map",
        courses: {
          BIPH3000: 3,
          ENVS3060: 3,
          ENVS3220: 3,
          LIFS2100: 4,
          OCES3010: 3,
          LIFS3002: 2,
          LIFS4000: 3,
        },
      },
    ],
  },
};

module.exports = BISC;
