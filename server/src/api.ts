import express from "express";
import { cleanPrompt, wordIndexOfDecoratedWord } from "./utils";
import { getToday } from "./today";
import { generateCompletionResponse } from "./completion";
import { getTodayStats, updateTodayStats } from "./todayStats";

export const apiRouter = express.Router();

apiRouter.get("/today", async (req, res) => {
	res.send({ ...getToday(), ...(await getTodayStats()) });
});

apiRouter.get("/complete", async (req, res) => {
	let prompt = req.query["prompt"] as string;
	if (!prompt) return res.status(400).send("Missing prompt");
	if (prompt.length > 300) return res.status(400).send("Prompt too long");
	if (prompt !== cleanPrompt(prompt)) return res.status(400).send("Invalid prompt");
	if (wordIndexOfDecoratedWord(prompt, getToday().word) !== -1) return res.status(400).send("Prompt contains word");
	try {
		const completionResponse = await generateCompletionResponse(prompt);
		updateTodayStats(completionResponse, req.session);
		res.send(completionResponse);
	} catch (e) {
		if (e instanceof Error) return res.status(500).send(e.message);
	}
});
