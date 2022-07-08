import fs from "fs";
import dayjs, { Dayjs } from "dayjs";
const words = fs.readFileSync("./words.txt", "utf8").split("\n");

export const getToday = () => {
	const dayNumber = getDayNumberFromDate(dayjs());
	const tomorrowUnix = getDateFromDayNumber(dayNumber + 1).valueOf();
	const secondsUntilTomorrow = Math.round((tomorrowUnix - Date.now()) / 1000) + 5; // w/ 5 seconds buffer
	let word = words[dayNumber % words.length];

	return { word, dayNumber, tomorrowUnix, secondsUntilTomorrow };
};

const PROMPTLE_EPOCH = dayjs("2022-07-05"); //5th of July 2022
/**
 * Will return date as dayNumber days since promptle epoch
 */
function getDateFromDayNumber(dayNumber: number) {
	return PROMPTLE_EPOCH.add(dayNumber, "day");
}
/**
 * Will return dayNumber as number of days since promptle epoch
 */
function getDayNumberFromDate(date: Dayjs) {
	return date.startOf("day").diff(PROMPTLE_EPOCH, "day");
}
