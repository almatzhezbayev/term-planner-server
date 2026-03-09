import express from "express";

const router = express.Router();

router.post("/upload", async (res) => {
	const text = await extractTranscriptText("file.pdf");
	res.json({ text });
});

export default router;
