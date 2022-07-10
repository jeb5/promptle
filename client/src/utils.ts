import { CompletedAttempt } from "./Game";

export function getBestAttempt(completedAttempts: CompletedAttempt[]) {
	const successfulCompletions = completedAttempts.filter(c => c.success);
	const bestCompletion =
		successfulCompletions.length > 0
			? successfulCompletions.reduce((best, c) => (c!.length < best!.length ? c : best))
			: null;
	return bestCompletion;
}

export function persistObject(key: string, obj: Object) {
	localStorage.setItem(key, JSON.stringify(obj));
}
export function retrievePersistedObject<T extends Object>(key: string, defaultObj: T): T {
	const obj = localStorage.getItem(key);
	if (!obj) return defaultObj;
	try {
		return JSON.parse(obj);
	} catch (e) {
		return defaultObj;
	}
}
export function cleanPrompt(prompt: string) {
	//These regular expressions ought to use lookbehinds, but Safari doesn't support them, so they've been modifed with capturing groups in the substitution.
	let cleanedPrompt = prompt;
	for (let i = 0; i < 2; i++) {
		cleanedPrompt = cleanedPrompt
			.replaceAll(/[^a-zA-Z 0-9'".,?!:;]/g, "") //Remove invalid characters
			.replaceAll(/[.!?:;,](?! |$|")/g, "") //Remove all .!?:;, except if they end the word, or are followed by a double quote
			.replaceAll(/([^ ])"(?! |$|[.!?:;,])/g, "$1") //Remove all double quotes that are sandwiched between a non-space to the left and a non-space or punctuation to the right //Orignal: /(?<! |^)"(?! |$|[.!?:;,])/g
			.replaceAll(/("[.!?:;,])"/g, "$1") //Remove all double quotes that are preceded by a double quote and punctuation (ie no "!"!"!") //Original: /(?<="[.!?:;,])"/g
			.replaceAll(/'(?=[a-zA-Z0-9]*')/g, "") //Remove all apostrophes that are succeeded by a word that also includes an apostrophe (there can be only one per word)
			.replaceAll(/([^ ]{23})[^ ]/g, "$1") //Remove all letters preceeded by 23 non-spaces //Original: /(?<=[^ ]{23})[^ ]/g
			.replaceAll(/ {2}/g, " ") //Remove all spaces preceeded by a space (no double spaces) //Original: /(?<= ) /g
			.trim();
	}
	return cleanedPrompt;
}
export function stringToWordCount(str: string) {
	if (str.trim().length === 0) return 0;
	return str.trim().split(" ").length;
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

export class InvalidRequestServerError extends Error {}
