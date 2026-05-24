// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202223/pdf/22-23phys.pdf
const PHYSICS = {
  prereq: {
    physicsI: new Set(["PHYS1111", "PHYS1112", "PHYS1312"]),
    physicsII: new Set(["PHYS1114", "PHYS1314"]),
  },

  required: {
    physLabI: new Set(["PHYS1113"]),
    physLabII: new Set(["PHYS1115"]),
    modernPhysics: new Set(["PHYS2022"]),
    modernPhysicsLab: new Set(["PHYS2023"]),
    seminarI: new Set(["PHYS2080"]),
    mathMethodsI: new Set(["PHYS2124"]),
    classicalMechanics: new Set(["PHYS3032"]),
    emI: new Set(["PHYS3033", "PHYS3053"]),
    qmI: new Set(["PHYS3036", "PHYS3037"]),
    computationalMethods: new Set(["PHYS3142"]),
    experimentalMethodsI: new Set(["PHYS3152"]),
    experimentalMethodsII: new Set(["PHYS3153"]),
    thermoStat: new Set(["PHYS4050"]),
    seminarII: new Set(["PHYS4080"]),
    capstone: new Set(["PHYS4191", "PHYS4291"]),
    calcI: new Set(["MATH1012", "MATH1013", "MATH1023"]),
    calcII: new Set(["MATH1014", "MATH1024"]),
    acceleratedCalc: new Set(["MATH1020"]),
    multivar: new Set(["MATH2023"]),
    linear: new Set(["MATH2121", "MATH2131"]),
    lang: new Set(["LANG3023", "LANG3027"]),
  },

  groupedNeeds: {
    contemporaryApplicationsNeed: 2,
  },

  groupedPools: {
    contemporaryApplications: new Set([
      "PHYS4811",
      "PHYS4812",
      "PHYS4813",
      "PHYS4814",
    ]),
  },
};

module.exports = PHYSICS;
