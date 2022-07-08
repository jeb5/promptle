import React, { useEffect } from "react";
import "./App.css";
import BlockText from "./BlockText";
import Icon from "./Icon";
import Game, { CompletedAttempt } from "./Game";
import Popup from "./Popup";
import Statistics from "./Statistics";
import Help from "./Help";
import { TodayInfo, UserStats } from "./DataManager";

function App(props: {
	todayInfo: TodayInfo;
	completedAttempts: CompletedAttempt[];
	userStats: UserStats;
	setCompletedAttempts: (completions: React.SetStateAction<CompletedAttempt[]>) => void;
	bestAttempt: CompletedAttempt | null;
	gameOver: boolean;
}) {
	const [popupState, setPopupState] = React.useState<"closed" | "help" | "stats">("closed");

	//handling game end
	useEffect(() => {
		if (props.gameOver) {
			//triggers on game end
			setPopupState("stats");
		}
	}, [props.gameOver]);

	return (
		<>
			<div className="app">
				<header className="header-bar">
					<Icon iconName="bar-chart" onClick={() => setPopupState("stats")} />
					<h1>
						<BlockText colors={[1, 1, 1, 1, 1, 1, 3, 3]} characterwise={true}>
							Promptle
						</BlockText>
					</h1>
					<Icon iconName="help" onClick={() => setPopupState("help")} />
				</header>
				<main className="main-content">
					<div className="today-info">
						<div className="today-word">
							Today's word is <span className="wordDisplay">{props.todayInfo.word}</span>
						</div>
						<div className="today-stats">
							Today's prompt average: {props.todayInfo.averagePromptLength || "?"} | Today's success rate:{" "}
							{Math.round(props.todayInfo.winPercentage * 100) + "%" || "?"}
						</div>
					</div>
					<Game
						word={props.todayInfo.word}
						completedAttempts={props.completedAttempts}
						setCompletedAttempts={props.setCompletedAttempts}
						bestAttempt={props.bestAttempt}
						gameOver={props.gameOver}
						showStats={() => setPopupState("stats")}
					/>
				</main>
			</div>
			{popupState === "help" && (
				<Popup title="How to Play" closeAction={() => setPopupState("closed")}>
					<Help />
				</Popup>
			)}
			{popupState === "stats" && (
				<Popup title="Statistics" closeAction={() => setPopupState("closed")}>
					<Statistics bestCompletion={props.bestAttempt} todayInfo={props.todayInfo} userStats={props.userStats} />
				</Popup>
			)}
		</>
	);
}
export default App;
