// reference: https://ugadmin.hkust.edu.hk/prog_crs/ug/202324/pdf/23-24ssci_requirements.pdf
const SREQ = {
  COMP: new Set(["COMP1021", "COMP1022P", "COMP2011"]),
  LANG: new Set(["LANG2010", "LANG2010H"]),
  lecs: {
    CHEM: new Set(["CHEM1008", "CHEM1020", "CHEM1030"]),
    LIFS: new Set([
      "LIFS1030", // listed in the 23-24 reference with a deletion remark
      "LIFS1901",
      "LIFS1902",
      "LIFS1930",
      "LIFS2210",
      "OCES1001",
      "OCES1010",
    ]),
    MATH: new Set([
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
    ]),
    PHYS: new Set([
      "PHYS1101",
      "PHYS1111",
      "PHYS1112",
      "PHYS1114",
      "PHYS1312",
      "PHYS1314",
    ]),
  },
  LABS: new Set([
    "CHEM1050",
    "CHEM1055",
    "LIFS1903",
    "LIFS1904",
    "PHYS1113",
    "PHYS1115",
  ]),
  lecNeed: 7,
  lecCap: 3,
  lecCount: {
    CHEM: 0,
    LIFS: 0,
    MATH: 0,
    PHYS: 0,
  },
};

module.exports = SREQ;
