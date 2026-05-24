// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202223/pdf/22-23chem.pdf
const CHEMISTRY = {
  prereq: {
    chemI: new Set(["CHEM1020"]),
    chemII: new Set(["CHEM1030"]),
  },

  required: {
    chemLabI: new Set(["CHEM1050"]),
    chemLabII: new Set(["CHEM1055"]),
    organicI: new Set(["CHEM2110"]),
    inorganicI: new Set(["CHEM2210"]),
    analytical: new Set(["CHEM2310"]),
    mathMethods: new Set(["CHEM2409"]),
    physicalI: new Set(["CHEM2410"]),
    synthLabI: new Set(["CHEM2550"]),
    characterizationLabI: new Set(["CHEM2555"]),
    organicII: new Set(["CHEM3120"]),
    inorganicII: new Set(["CHEM3220"]),
    instrumental: new Set(["CHEM3320"]),
    physicalII: new Set(["CHEM3420"]),
    synthLabII: new Set(["CHEM3550"]),
    characterizationLabII: new Set(["CHEM3555"]),
    calculus: new Set(["MATH1012", "MATH1013", "MATH1020", "MATH1023"]),
    lang: new Set(["LANG3022", "LANG3027"]),
  },

  groupedOptions: {
    capstoneDirect: new Set(["CHEM4689", "CHEM4691"]),
    capstoneIre: new Set(["SCIE3500", "SCIE4500"]),
  },

  electiveNeeds: {
    chem3000PlusNeed: 1,
    science2000PlusNeed: 1,
  },

  scienceSubjects: ["BIPH", "CHEM", "DASC", "ENVS", "LIFS", "MATH", "OCES", "PHYS"],
};

module.exports = CHEMISTRY;
