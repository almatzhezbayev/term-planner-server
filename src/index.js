const express = require("express");
const cors = require("cors");

const getText = require("./services/getText");
const parse = require("./services/parse");
const evalRem = require("./services/evalRem");

const app = express();
const pdfBodyParser = express.raw({
  type: ["application/pdf", "application/octet-stream"],
  limit: "10mb",
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.post("/api/parse", pdfBodyParser, async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      throw new Error(
        "Request body must contain a PDF file sent as raw binary with Content-Type: application/pdf",
      );
    }

    const text = await getText(req.body);
    const parsed = parse(text);

    res.json(parsed);
  } catch (err) {
    res.status(500).json({
      error: "Failed to parse transcript:" + err.message,
    });
  }
});

app.post("/api/requirements", async (req, res) => {
  try {
    const { school, major, admitTerm, semesters } = req.body || {};

    if (!school || !major || !admitTerm || !semesters) {
      return res.status(400).json({
        error:
          "Request body must include school, major, admitTerm, and semesters.",
      });
    }

    if (typeof semesters !== "object" || Array.isArray(semesters)) {
      return res.status(400).json({
        error: "semesters must be a JSON object keyed by term.",
      });
    }

    const courses = Set(Object.values(semesters || {}).flat());

    const rem = evalRem({
      courses,
      admitTerm,
      school,
      major,
    });

    res.json({
      // school,
      // major,
      // admitTerm,
      // semesters,
      rem,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to evaluate remaining requirements:" + err.message,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
