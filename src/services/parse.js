function parse(text) {
  const semesterRegex = /(20\d{2}-\d{2})\s+(Fall|Spring|Winter|Summer)/g;
  const courseRegex = /\b[A-Z]{4}\d{4}[A-Z]?\b/g;

  const semesters = {};
  const semesterMatches = [...text.matchAll(semesterRegex)];

  for (let i = 0; i < semesterMatches.length; i++) {
    const start = semesterMatches[i].index;
    const end = semesterMatches[i + 1]?.index || text.length;

    const year = semesterMatches[i][1];
    const term = semesterMatches[i][2];

    const key =
      year.slice(2) +
      (term === "Fall"
        ? "f"
        : term === "Spring"
          ? "s"
          : term === "Winter"
            ? "w"
            : "u");

    const block = text.slice(start, end);

    const courses = [...block.matchAll(courseRegex)]
      .map((m) => m[0])
      .filter((c) => c !== "CORE1402"); // remove transfer credit if needed

    semesters[key] = courses;
  }

  return {
    intakeYear: semesterMatches[0]?.[1] || null,
    semesters,
  };
}

module.exports = parse;
