import express from "express";
import dotenv from "dotenv";
import { apiRouter } from "./api";
import { redisExpressSession } from "./redis";

dotenv.config();
export const OPEN_AI_SECRET_KEY = process.env.OPEN_AI_SECRET_KEY;

const app = express();

app.use(redisExpressSession);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
