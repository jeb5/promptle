import React from "react";
import BlockText, { BlockColor } from "./BlockText";
import Icon from "./Icon";
import "./PromptBox.css";

export default function PromptBox(props: {
	colors: BlockColor[];
	text: string;
	editable?: boolean;
	sendable?: boolean;
	icon?: "check" | "cross" | "pending";
	handleSend?: () => void;
	handleValueChange?: (newValue: string) => void;
	displayLengths: {
		prompt: number;
		extra?: number;
		total?: number;
	};
}) {
	const { colors, text, displayLengths } = props;
	const editable = props.editable !== undefined ? props.editable : false;
	const sendable = props.sendable !== undefined ? props.sendable : false;
	const icon = props.icon !== undefined ? props.icon : null;
	const handleSend = props.handleSend !== undefined ? props.handleSend : () => {};
	const handleValueChange = props.handleValueChange !== undefined ? props.handleValueChange : () => {};

	return (
		<div className="box-prompt large-block">
			<div className="prompt-auto-expander">
				<div className="prompt-backboard prompt-text">
					<BlockText colors={colors}>{text}</BlockText>
				</div>
				<textarea
					className="prompt prompt-text"
					placeholder="Enter prompt..."
					spellCheck="false"
					readOnly={!editable}
					value={text}
					rows={1}
					onChange={event => handleValueChange(event.target.value)}
					onKeyDown={event => {
						if (event.key === "Enter" && sendable) handleSend();
					}}
				/>
			</div>
			<div className="attempt-box-bottom">
				<div className="prompt-feedback">
					<span className="promptwc" key="1">
						Prompt: {displayLengths.prompt}
					</span>
					{props.displayLengths.extra !== undefined && [
						" | ",
						<span className="extrawc" key="2">
							Extra: {props.displayLengths.extra}
						</span>,
					]}
					{props.displayLengths.total !== undefined && [
						" | ",
						<span className="totalwc" key="3">
							Total: {props.displayLengths.total}
						</span>,
					]}
				</div>
				{editable ? (
					<button disabled={!sendable} className="submitBtn" onClick={handleSend}>
						Submit
					</button>
				) : (
					<Icon iconName={icon} />
				)}
			</div>
		</div>
	);
}
