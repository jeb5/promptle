import React from "react";
import { BlockColor, BlockColors } from "./BlockText";
import { CompletedAttempt } from "./Game";
import PromptBox from "./PromptBox";
import { cleanPrompt, InvalidRequestServerError, wordIndexOfDecoratedWord } from "./utils";

export default function EditableAttempt(props: {
	word: string;
	finishAttempt: (completedAttempt: CompletedAttempt) => void;
}) {
	const [promptValue, setPromptValue] = React.useState("");
	const [isPending, setIsPending] = React.useState(false);

	const handlePromptChange = (value: string) => {
		const cleanedPrompt = cleanPrompt(value); //remove all non-legal charcters and double spaces
		const endInSpace = value.endsWith(" ") && cleanPrompt.length > 0;
		const newValue = cleanedPrompt + (endInSpace ? " " : "");
		setPromptValue(newValue);
	};

	const promptInError = wordIndexOfDecoratedWord(promptValue, props.word) !== -1;

	const sendPrompt = async () => {
		if (promptLength === 0 || promptInError) return;
		setPromptValue(promptValue.trim());
		setIsPending(true);
		let response: {
			completion: string;
			success: boolean;
			promptLength: number;
			completionLength: number;
			fullText: string;
		};
		try {
			response = await fetch(`/api/complete?prompt=${promptValue.trim()}`).then(async res => {
				if (res.status === 400 || res.status === 500) throw new InvalidRequestServerError(await res.text());
				return await res.json();
			});
		} catch (e) {
			if (e instanceof InvalidRequestServerError) {
				alert(`Error: ${e.message}`);
				setIsPending(false);
				return;
			}
		}
		response = response!; //Keeps typescript happy

		props.finishAttempt({
			prompt: promptValue.trim(),
			completion: response.completion,
			success: response.success,
			length: response.promptLength + response.completionLength,
			colors: [
				...Array(response.promptLength).fill(BlockColors.PROMPT),
				...Array(response.completionLength).fill(BlockColors.COMPLETION),
				...(response.success ? [BlockColors.WORD] : []),
			],
		});
	};

	const promptLength = promptValue.length > 0 ? promptValue.trim().split(" ").length : 0;

	let backdropColors = promptValue
		.trim()
		.split(" ")
		.map(cword =>
			wordIndexOfDecoratedWord(cword, props.word) !== -1 ? BlockColors.ERROR : BlockColors.PROMPT
		) as BlockColor[];

	return (
		<PromptBox
			text={promptValue}
			colors={backdropColors}
			editable={!isPending}
			sendable={!isPending && !promptInError && promptLength > 0}
			icon={isPending ? "pending" : undefined}
			displayLengths={{ prompt: promptLength }}
			handleSend={sendPrompt}
			handleValueChange={handlePromptChange}
		/>
	);
}
