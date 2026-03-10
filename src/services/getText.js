const fs = require("node:fs");
const { PDFParse } = require("pdf-parse");

async function getText(path) {
  try {
    console.log("[getText] Starting extraction");
    console.log("[getText] Path:", path);

    if (!fs.existsSync(path)) {
      throw new Error("PDF file not found");
    }

    console.log("[getText] Reading file...");
    const buffer = fs.readFileSync(path);
    console.log("[getText] Buffer size:", buffer.length);

    console.log("[getText] Creating PDF parser...");
    const parser = new PDFParse({ data: buffer });

    console.log("[getText] Extracting text...");
    const result = await parser.getText();

    console.log("[getText] Extraction finished");
    console.log("[getText] Pages:", result.numpages);
    console.log("[getText] Text length:", result.text.length);
    console.log("[getText] Text:", result.text);

    return result.text;
  } catch (err) {
    console.error("[getText] ERROR during parsing");
    console.error(err);
    throw err;
  }
}

module.exports = getText;
