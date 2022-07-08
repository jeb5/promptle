import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import App from "./App";
import { CompletedAttempt } from "./Game";
import { getBestAttempt, persistObject, retrievePersistedObject } from "./utils";

export const ATTEMPT_COUNT = 5;

export type TodayInfo = {
	word: string;
	dayNumber: number;
	tomorrowUnix: number;
	secondsUntilTomorrow: number;
	winPercentage: number;
	averagePromptLength: number;
};

export type UserStats = {
	gamesPlayed: number;
	gamesWon: number;
	streak: number;
	lastGameWon: number;
	lastGamePlayed: number;
};

export default function DataManager() {
	const todayQuery = useQuery("today", () =>
		fetch("/api/today")
			.then(res => res.json())
			.then(data => data as TodayInfo)
	);
	const [completedAttempts, setCompletedAttempts] = useState<CompletedAttempt[]>([]);
	const [attemptedDataLoad, setAttemptedDataLoad] = useState(false); //have we attempted to load the persisted data yet? It should only happen once.

	const [userStats, setUserStats] = useState<UserStats | null>(null);

	const bestAttempt = getBestAttempt(completedAttempts);
	const gameOver = completedAttempts.length >= ATTEMPT_COUNT;

	//handle updating user stats when the first win occurs or when game ends
	useEffect(() => {
		if (!todayQuery.isSuccess) return;
		if (userStats === null) return;
		if (userStats.lastGameWon === todayQuery.data!.dayNumber) return; //We've already set the game as won
		if (userStats.lastGamePlayed !== todayQuery.data!.dayNumber) {
			//Updates "played" information
			if (completedAttempts.length !== 0)
				setUserStats(userStats => ({
					...userStats!,
					gamesPlayed: userStats!.gamesPlayed + 1,
					lastGamePlayed: todayQuery.data!.dayNumber,
				}));
		}
		if (userStats.lastGameWon !== todayQuery.data!.dayNumber) {
			//Updates "won" information
			if (bestAttempt !== null) {
				setUserStats(userStats => ({
					...userStats!,
					gamesWon: userStats!.gamesWon + 1,
					streak: userStats!.streak + 1,
					lastGameWon: todayQuery.data!.dayNumber,
				}));
			}
		}
	}, [userStats, todayQuery, bestAttempt, gameOver, completedAttempts]);

	//handling retrieving persisted game state & user stats from local storage + page reload
	useEffect(() => {
		if (todayQuery.isSuccess && !attemptedDataLoad) {
			//reload the page when we reach tomorrow
			setTimeout(() => {
				window.location.reload();
			}, todayQuery.data.secondsUntilTomorrow * 1000);

			//retrieve persisted completedAttempts
			const retrievedGameData = retrievePersistedObject("gameState", {
				day: todayQuery.data.dayNumber,
				completedAttempts: [],
			}) as { day: number; completedAttempts: CompletedAttempt[] };
			if (retrievedGameData.day === todayQuery.data.dayNumber)
				setCompletedAttempts(retrievedGameData.completedAttempts);

			//retrieve persisted user stats
			let retrievedUserStats = retrievePersistedObject<UserStats>("userStats", {
				gamesPlayed: 0,
				gamesWon: 0,
				streak: 0,
				lastGameWon: -10,
				lastGamePlayed: -10,
			});
			//if we didn't play yesterday, streak drops to 0
			retrievedUserStats = {
				...retrievedUserStats,
				streak: retrievedUserStats.lastGameWon + 1 === todayQuery.data.dayNumber ? retrievedUserStats.streak : 0,
			};
			setUserStats(retrievedUserStats);

			setAttemptedDataLoad(true);
		}
	}, [todayQuery, attemptedDataLoad]);

	//handling persisting game state to local storage
	useEffect(() => {
		if (attemptedDataLoad && todayQuery.isSuccess)
			//persist completedAttempts
			persistObject("gameState", { day: todayQuery.data.dayNumber, completedAttempts });
	}, [completedAttempts, todayQuery, attemptedDataLoad]);

	//handle persisting user stats to local storage
	useEffect(() => {
		if (userStats !== null) persistObject("userStats", userStats);
	}, [userStats]);

	return todayQuery.isSuccess && attemptedDataLoad ? (
		<App
			todayInfo={todayQuery.data}
			bestAttempt={bestAttempt}
			completedAttempts={completedAttempts}
			userStats={userStats!}
			setCompletedAttempts={setCompletedAttempts}
			gameOver={gameOver}
		/>
	) : null;
}
