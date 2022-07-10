import React from "react";
import { ATTEMPT_COUNT } from "./DataManager";
import EditableAttempt from "./EditableAttempt";
import "./Game.css";
import PromptBox from "./PromptBox";
import { stringToWordCount } from "./utils";

export type AttemptStatus = "editing" | "pending" | "done";
export type CompletedAttempt = {
	prompt: string;
	completion: string;
	length: number;
	success: boolean;
	colors: (1 | 2 | 3 | 4)[];
};

export default function Game(props: {
	word: string;
	completedAttempts: CompletedAttempt[];
	setCompletedAttempts: (completions: React.SetStateAction<CompletedAttempt[]>) => void;
	bestAttempt: CompletedAttempt | null;
	gameOver: boolean;
	showStats: () => void;
}) {
	//TODO: Next editable attempt ought to draw focus (be typed into by default)
	return (
		<>
			<div className="attempt-boxes">
				{[...props.completedAttempts, null].slice(0, ATTEMPT_COUNT).map((attemptMaybe, index) => (
					<div className="attempt-box" key={index}>
						<div className="attempt-box-label">
							Attempt {index + 1}/{ATTEMPT_COUNT}
						</div>
						{attemptMaybe !== null ? (
							<PromptBox
								text={attemptMaybe.prompt + " " + attemptMaybe.completion}
								colors={attemptMaybe.colors}
								icon={attemptMaybe.success ? "check" : "cross"}
								displayLengths={{
									prompt: stringToWordCount(attemptMaybe.prompt),
									...(attemptMaybe.success
										? { extra: stringToWordCount(attemptMaybe.completion) - 1, total: attemptMaybe.length }
										: {}),
								}}
							/>
						) : (
							<EditableAttempt
								word={props.word}
								finishAttempt={attempt => {
									props.setCompletedAttempts(completions => [...completions, attempt]);
								}}
							/>
						)}
					</div>
				))}
			</div>
			<div className="game-footer">
				<div className="game-best">{props.bestAttempt !== null && `Best: ${props.bestAttempt.length}`}</div>
				{!props.gameOver && (
					<button className="view-stats-btn" onClick={props.showStats} disabled={props.bestAttempt === null}>
						Show Results
					</button>
				)}
			</div>
		</>
	);
}
