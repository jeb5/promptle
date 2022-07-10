export function cleanPrompt(prompt: string) {
	//These regular expressions ought to use lookbehinds, but Safari doesn't support them, so they've been modifed with capturing groups in the substitution.
	//https://caniuse.com/js-regexp-lookbehind
	let cleanedPrompt = prompt;
	for (let i = 0; i < 2; i++) {
		cleanedPrompt = cleanedPrompt
			.replaceAll(/[^a-zA-Z 0-9'".,?!:;]/g, "") //Remove invalid characters
			.replaceAll(/[.!?:;,](?! |$|")/g, "") //Remove all .!?:;, except if they end the word, or are followed by a double quote
			.replaceAll(/([^ ])"(?! |$|[.!?:;,])/g, "$1") //Remove all double quotes that are sandwiched between a non-space to the left and a non-space or punctuation to the right //Orignal: /(?<! |^)"(?! |$|[.!?:;,])/g
			.replaceAll(/("[.!?:;,])"/g, "$1") //Remove all double quotes that are preceded by a double quote and punctuation (ie no "!"!"!") //Original: /(?<="[.!?:;,])"/g
			.replaceAll(/'(?=[a-zA-Z0-9]*')/g, "") //Remove all apostrophes that are succeeded by a word that also includes an apostrophe (there can be only one per word)
			.replaceAll(/([^ ]{23})[^ ]/g, "$1") //Remove all letters preceeded by 30 non-spaces //Original: /(?<=[^ ]{23})[^ ]/g
			.replaceAll(/ {2}/g, " ") //Remove all spaces preceeded by a space (no double spaces) //Original: /(?<= ) /g
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
	//Again, this ought to use lookbehinds
	return text
		.trim()
		.split(" ")
		.findIndex(w => w.toLowerCase().replaceAll(/(^[^a-z]+([a-z]))|(([a-z])[^a-z]+$)/g, "$2$4") === word.toLowerCase());
	//original: /(^[^a-z]+(?=[a-z]))|((?<=[a-z])[^a-z]+$)/g
}

export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
