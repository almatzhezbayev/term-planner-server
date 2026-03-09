import fs from "npde:fs";
import pdf from "pdf-parse";

async function getText(path) {
	const buffer = fs.readFileSync(path);
	const data = await pdf(buffer);
	return data.text;
}

export default getText;
