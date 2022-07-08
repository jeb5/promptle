import React from "react";
import "./Help.css";
import PromptBox from "./PromptBox";

export default function Help() {
	return (
		<>
			<p>Prompt the computer to say the word of the day.</p>
			<p>
				After writing a prompt, the computer will “complete” it by generating more text. Your goal is to make the
				computer say the day’s word without saying it yourself.
			</p>
			<p>To get the lowest score, you need to minimise the number of words in your prompt.</p>
			<h3>An Example</h3>
			<p>
				If the word of the day was <strong>scissors</strong>, you might prompt the computer by saying:
			</p>
			<PromptBox text="Let's play rock paper" colors={[1, 1, 1, 1]} displayLengths={{ prompt: 4 }} />
			<p>
				The computer would then complete the text, giving you a score of <strong>4 words</strong>.
			</p>
			<PromptBox
				text="Let's play rock paper scissors"
				colors={[1, 1, 1, 1, 3]}
				displayLengths={{ prompt: 4, extra: 0, total: 4 }}
				icon="check"
			/>
		</>
	);
}
