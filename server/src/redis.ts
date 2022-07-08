import dotEnv from "dotenv";
import connectRedis from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { getToday } from "./today";

dotEnv.config();

const redisOptions = {
	url: "redis://redis:6379",
	password: process.env.REDIS_PASSWORD,
};
const redisSessionClient = createClient({
	//For use only with express sessions. Legacy mode breaks other methods, like .get
	...redisOptions,
	legacyMode: true, // necessary for connect-redis sessions
});
redisSessionClient.on("error", err => console.log("Redis Client Error", err));
redisSessionClient.connect().catch(console.error);

const redisClient = createClient(redisOptions);
redisClient.on("error", err => console.log("Redis Client Error", err));
redisClient.connect().catch(console.error);

const RedisSessionStore = connectRedis(session);

export const redisExpressSession = session({
	store: new RedisSessionStore({ client: redisSessionClient }),
	secret: process.env.SESSION_SECRET,
	name: "Session",
	saveUninitialized: true, //saveUninitialized being set to false prevents cookies from being saved if the session object isn't modified. Without cookies, the session ID changes with every request
	resave: false,
	cookie: {
		secure: process.env.NODE_ENV === "production",
		// sameSite: "strict",
	},
});

const REDIS_TEMP_EXP = 60 * 60 * 24 * 7 * 52; // 52 weeks
export async function redisGetOrSetTemp(key: string, cb: () => Promise<string>, expiry?: number): Promise<string> {
	const dataExpiry = expiry || REDIS_TEMP_EXP;
	const redisData = await redisClient.get(key);
	if (redisData !== null) return redisData;
	const freshData = await cb();
	await redisClient.setEx(key, dataExpiry, freshData);
	return freshData;
}

export async function redisGetOrSetTodayInfo(key: string, defaultValue: string) {
	const todayInfo = getToday();
	const mKey = `today-info/${todayInfo.dayNumber}/${key}`;
	const redisData = await redisClient.get(mKey);
	if (typeof redisData === "string") return redisData;
	await redisClient.setEx(mKey, todayInfo.secondsUntilTomorrow, defaultValue);
	return defaultValue;
}
export async function redisSetTodayInfo(key: string, newValue: string) {
	const todayInfo = getToday();
	const mKey = `today-info/${todayInfo.dayNumber}/${key}`;
	await redisClient.setEx(mKey, todayInfo.secondsUntilTomorrow, newValue);
}
export async function redisIncrementTodayInfo(key: string, increment?: number) {
	const incrementNum = increment || 1;
	const todayInfo = getToday();
	const mKey = `today-info/${todayInfo.dayNumber}/${key}`;
	await redisClient.incrBy(mKey, incrementNum);
	await redisClient.expire(mKey, todayInfo.secondsUntilTomorrow);
}
