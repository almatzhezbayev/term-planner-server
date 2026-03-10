function parse(text) {
  // get admission date fist in a form of 22-23f
  const admitMatch = text.match(
    /Admit Date:\s*[\s\S]*?([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})/,
  );

  if (!admitMatch) throw new Error("Admit Date not found");

  const date = new Date(admitMatch[1]);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  let term;
  if (month >= 9) term = "f";
  else if (month === 1) term = "w";
  else if (month <= 5) term = "s";
  else term = "sm";

  const startYear = month >= 9 ? year : year - 1;

  const admitTerm = `${String(startYear).slice(-2)}-${String(startYear + 1).slice(-2)}${term}`;

  // get major
  const majorMatch = text.match(/Major:\s*([^\n]+)/);

  if (!majorMatch) throw new Error("Major not found");

  const majorText = majorMatch[1].trim();

  const mathTracks = {
    "Pure Mathematics": "pm",
    "Pure Mathematics (Advanced)": "pma",
    "Applied Mathematics": "am",
    Statistics: "s",
    "Financial and Actuarial Mathematics": "fam",
    "Computer Science": "cs",
    "General Mathematics": "gm",
  };

  let major = null;

  for (const track in mathTracks) {
    if (majorText.includes(track)) {
      major = `math-${mathTracks[track]}`;
      break;
    }
  }

  if (!major) {
    throw new Error(`Unknown math major: ${majorText}`);
  }

  // get school
  const schoolMatch = text.match(/School of ([A-Za-z]+)/);

  if (!schoolMatch) throw new Error("School not found");

  const school = schoolMatch[1].toLowerCase();

  // get courses taken each semester
  const semesterRegex = /(20\d{2}-\d{2})\s+(Fall|Winter|Spring|Summer)/g;

  const courseRegex = /\b[A-Z]{4}\d{4}[A-Z]?\b/g;

  const termMap = {
    Fall: "f",
    Winter: "w",
    Spring: "s",
    Summer: "sm",
  };

  const semesters = {};
  const semesterMatches = [...text.matchAll(semesterRegex)];

  for (let i = 0; i < semesterMatches.length; i++) {
    const match = semesterMatches[i];

    const yearBlock = match[1];
    const termWord = match[2];

    const startIndex = match.index;

    const endIndex =
      i + 1 < semesterMatches.length
        ? semesterMatches[i + 1].index
        : text.length;

    const block = text.slice(startIndex, endIndex);

    const startYear = yearBlock.slice(2, 4);
    const endYear = yearBlock.slice(5, 7);

    const semesterKey = `${startYear}-${endYear}${termMap[termWord]}`;

    const courses = [];

    const courseMatches = [...block.matchAll(courseRegex)];

    for (const c of courseMatches) {
      const lineStart = block.lastIndexOf("\n", c.index);
      const lineEnd = block.indexOf("\n", c.index);

      const line = block.slice(lineStart, lineEnd);

      if (!/\sF\s*$/.test(line)) {
        courses.push(c[0]);
      }
    }

    semesters[semesterKey] = courses;
  }

  return {
    school,
    major,
    admitTerm,
    semesters,
  };
}

module.exports = parse;
