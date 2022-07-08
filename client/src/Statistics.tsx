import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TodayInfo, UserStats } from "./DataManager";
import { CompletedAttempt } from "./Game";
import Icon from "./Icon";
import "./Statistics.css";

dayjs.extend(relativeTime);

export default function Statistics(props: {
	bestCompletion: CompletedAttempt | null;
	todayInfo: TodayInfo;
	userStats: UserStats;
}) {
	const share = () => {
		alert("yet to be implemented");
	};

	const timeLeftSpanRef = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		function setTime() {
			if (timeLeftSpanRef.current) timeLeftSpanRef.current!.innerText = dayjs().to(dayjs(props.todayInfo.tomorrowUnix));
		}
		const timingInterval = setInterval(setTime, 1000);
		setTime();
		return () => clearInterval(timingInterval);
		// eslint-disable-next-line
	}, []);

	const successfulDay = props.bestCompletion !== null;

	return (
		<>
			<div className={`large-block today-result stats-box${successfulDay ? " today-result-success" : ""}`}>
				<p>
					{successfulDay ? (
						<strong>
							You prompted "{props.todayInfo.word}" in {props.bestCompletion!.length} words
						</strong>
					) : (
						<strong>You have not yet prompted "{props.todayInfo.word}"</strong>
					)}
				</p>
				<p>
					Today's average: {props.todayInfo.averagePromptLength || "?"} | Today's success rate:{" "}
					{Math.round(props.todayInfo.winPercentage * 100) + "%" || "?"}
				</p>
				<div className="today-result-foot">
					{props.bestCompletion !== null && (
						<button className="sharey-btn" onClick={share}>
							{/* "sharey-btn" because adblock isn't a fan of the class name "share-btn" */}
							Share
							<Icon iconName="sharey" />
						</button>
					)}
				</div>
			</div>
			<div className="large-block your-stats stats-box">
				<div className="your-stat-boxes">
					<div className="your-stat-box">
						<div>Games Played:</div>
						<div>{props.userStats.gamesPlayed}</div>
					</div>
					<div className="your-stat-box">
						<div>Win Rate:</div>
						<div>
							{props.userStats.gamesPlayed !== 0
								? `${Math.floor((100 * props.userStats.gamesWon) / props.userStats.gamesPlayed)}%`
								: "N/A"}
						</div>
					</div>
					<div className="your-stat-box">
						<div>Daily Streak:</div>
						<div>{props.userStats.streak}</div>
					</div>
				</div>
			</div>
			<div className="large-block next-word-box stats-box">
				Next word <span className="next-word" ref={timeLeftSpanRef}></span>
			</div>
		</>
	);
}
