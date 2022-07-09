import { ATTEMPT_COUNT, CompletionResponse } from "./completion";
import session from "express-session";
import { redisGetOrSetTodayInfo, redisIncrementTodayInfo, redisSetTodayInfo } from "./redis";

export async function updateTodayStats(completionResponse: CompletionResponse, session: session.Session) {
	const totalPromptLength = completionResponse.promptLength + completionResponse.completionLength;
	const playerGamesPlayed = Number(await redisGetOrSetTodayInfo(`player/${session.id}/games-played`, "0"));
	const playerShortestCompletion = Number(
		await redisGetOrSetTodayInfo(`player/${session.id}/shortest-completion`, "-1")
	);
	const playerHasYetSucceeded = playerShortestCompletion !== -1;

	redisIncrementTodayInfo(`player/${session.id}/games-played`);
	if (playerGamesPlayed === 0) {
		//if this is a player's first attempt, increment the total games played
		redisIncrementTodayInfo(`total/games-played`);
	}
	if (!playerHasYetSucceeded && completionResponse.success) {
		//if this is a player's first win, increment the total wins
		redisIncrementTodayInfo(`total/games-won`);
	}
	if (completionResponse.success && (playerShortestCompletion === -1 || totalPromptLength < playerShortestCompletion)) {
		//if this is a player's first win, or if this is a shorter completion, update the player's shortest completion
		redisSetTodayInfo(`player/${session.id}/shortest-completion`, String(totalPromptLength));
	}
	if (playerGamesPlayed + 1 === ATTEMPT_COUNT && (playerHasYetSucceeded || completionResponse.success)) {
		//if this is the last attempt and the player has won at least one attempt, update today's stats accordingly
		const playersBestCompletion = Math.min(playerShortestCompletion, totalPromptLength);
		redisIncrementTodayInfo(`total/games-finished-won`); //games both finished and won
		redisIncrementTodayInfo(`total/best-prompt-lengths-sum`, playersBestCompletion); //total prompt lengths summed from all games finished and won
	}
}

export async function getTodayStats() {
	const [totalGamesPlayed, totalGamesWon, totalGamesFinishedAndWon, totalBestPromptLengthsSum] = await Promise.all([
		Number(await redisGetOrSetTodayInfo("total/games-played", "0")),
		Number(await redisGetOrSetTodayInfo("total/games-won", "0")),
		Number(await redisGetOrSetTodayInfo("total/games-finished-won", "0")),
		Number(await redisGetOrSetTodayInfo("total/best-prompt-lengths-sum", "0")),
	]);

	const winPercentage = totalGamesPlayed > 0 ? totalGamesWon / totalGamesPlayed : 0;
	const averagePromptLength = totalGamesFinishedAndWon > 0 ? totalBestPromptLengthsSum / totalGamesFinishedAndWon : 0;
	return { winPercentage, averagePromptLength };
}
