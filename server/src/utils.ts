export function cleanPrompt(prompt: string) {
	let cleanedPrompt = prompt;
	for (let i = 0; i < 2; i++) {
		cleanedPrompt = cleanedPrompt
			.replaceAll(/[^a-zA-Z 0-9'".,?!:;]/g, "") //Remove invalid characters
			.replaceAll(/[.!?:;,](?! |$|")/g, "") //Remove all .!?:;, except if they end the word, or are followed by a double quote
			.replaceAll(/(?<! |^)"(?! |$|[.!?:;,])/g, "") //Remove all double quotes that are sandwiched between a non-space to the left and a non-space or punctuation to the right
			.replaceAll(/(?<="[.!?:;,])"/g, "") //Remove all double quotes that are preceded by a double quote and punctuation (ie no "!"!"!")
			.replaceAll(/'(?=[a-zA-Z0-9]*')/g, "") //Remove all apostrophes that are succeeded by a word that also includes an apostrophe (there can be only one per word)
			.replaceAll(/(?<=[^ ]{30})[^ ]/g, "") //Remove all letters preceeded by 30 non-spaces
			.replaceAll(/(?<= ) /g, "") //Remove all spaces preceeded by a space (no double spaces)
			.trim();
	}
	return cleanedPrompt;
}
export function stringToWordCount(str: string) {
	if (str.trim().length === 0) return 0;
	return str.trim().split(" ").length;
}
export function cleanCompletion(completion: string) {
	return completion
		.replaceAll(/\n/g, " ")
		.replaceAll(/(?<= ) /g, "") //Remove all spaces preceeded by a space (no double spaces)
		.trim();
}

/**
 * Returns the first word-wise index of a word (case-insensitive) in a string, ignoring all non-alphanumeric characters that may appear before and after the word.
 */
export function wordIndexOfDecoratedWord(text: string, word: string): number {
	return text
		.trim()
		.split(" ")
		.findIndex(w => w.toLowerCase().replaceAll(/(^[^a-z]+(?=[a-z]))|((?<=[a-z])[^a-z]+$)/g, "") === word.toLowerCase());
}

export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
