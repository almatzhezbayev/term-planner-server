const express = require("express");
const getText = require("./services/getText");
const parse = require("./services/parse");

const app = express();

app.use(express.json());

app.post("/api/transcript/parse", async (_req, res) => {
  try {
    const text = await getText("file.pdf");
    const parsed = parse(text);

    res.json(parsed);
  } catch (err) {
    res.status(500).json({
      error: "Failed to parse transcript",
      err: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
