import { cleanCompletion, sleep, stringToWordCount, wordIndexOfDecoratedWord } from "./utils";
import { getToday } from "./today";
import { redisGetOrSetTemp } from "./redis";

export const ATTEMPT_COUNT = 5; //The total number of attempts allowed per player

export type CompletionResponse = {
	completion: string;
	success: boolean;
	promptLength: number;
	completionLength: number;
	fullText: string;
};

type OpenAiResponse = { choices: { text: string }[] };

export async function generateCompletionResponse(prompt: string): Promise<CompletionResponse> {
	const completion = await findCompletion(prompt);

	const indexOfTargetWord = wordIndexOfDecoratedWord(completion, getToday().word);
	const successful = indexOfTargetWord !== -1;

	const trimmedCompletion = successful
		? completion
				.split(" ")
				.slice(0, indexOfTargetWord + 1)
				.join(" ")
		: completion;

	return {
		completion: trimmedCompletion,
		success: indexOfTargetWord !== -1,
		promptLength: stringToWordCount(prompt),
		completionLength: stringToWordCount(trimmedCompletion) - (successful ? 1 : 0),
		fullText: prompt + " " + trimmedCompletion,
	};
}

async function findCompletion(prompt: string) {
	const completion = redisGetOrSetTemp("completion/" + prompt, () => generateCompletion(prompt));
	return completion;
}

async function generateCompletion(prompt: string) {
	const response = (await fetch("https://api.openai.com/v1/completions", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + process.env.OPEN_AI_SECRET_KEY,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ prompt, model: "text-davinci-002", temperature: 0 }),
	}).then(response => {
		if (response.ok) return response.json();
		throw new Error("OpenAI API Error");
	})) as OpenAiResponse;

	const completion = response?.choices?.[0]?.text;

	if (!completion) throw new Error("No completion generated");

	const modifiedCompletion = cleanCompletion(completion);
	return modifiedCompletion;
}
