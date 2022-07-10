import React from "react";
import "./BlockText.css";

export type BlockColor = 1 | 2 | 3 | 4;

export const BlockColors = {
	PROMPT: 1,
	COMPLETION: 2,
	WORD: 3,
	ERROR: 4,
};
const ColorClasses = {
	[BlockColors.PROMPT]: "prompt-block",
	[BlockColors.COMPLETION]: "completion-block",
	[BlockColors.WORD]: "word-block",
	[BlockColors.ERROR]: "error-block",
};

function BlockText(props: { children: string; colors: (1 | 2 | 3 | 4)[]; characterwise?: boolean }) {
	const splitChar = props.characterwise ? "" : " ";
	const newChildren = props.children
		.split(splitChar)
		.filter(c => c.length > 0)
		.map((text, index, stringArray) => {
			return (
				<span
					key={index}
					className={`blockText-span ${ColorClasses[props.colors[index]]}`}
					data-content={text}
					/*
						This data attribute is used as the "content" of the span's ::before pseudo-element.
						I shouldn't need to set content for this pseudo-element, but Safari refuses to repaint the element if some attribute on it doesn't change as the text changes.
						(See https://stackoverflow.com/a/3485654)
					*/
					style={
						{
							...(props.characterwise && index !== 0
								? {
										"--block-left": "0",
								  }
								: {}),
							...(props.characterwise && index !== stringArray.length - 1
								? {
										"--block-right": "0",
								  }
								: {}),
						} as React.CSSProperties
					}>
					{text}
				</span>
			);
		})
		.reduce((prev, curr) => [...prev, ...(prev.length ? [splitChar] : []), curr], [] as (string | JSX.Element)[]);
	return <>{newChildren}</>;
}

export default BlockText;
