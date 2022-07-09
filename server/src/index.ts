import express from "express";
import "dotenv/config";
import path from "path";
import helmet from "helmet";
import { apiRouter } from "./api";
import { redisExpressSession } from "./redis";

export const OPEN_AI_SECRET_KEY = process.env.OPEN_AI_SECRET_KEY;

const app = express();
app.use(helmet());
const indexRouter = express.Router();
app.use(process.env.BASE_PATH || "/", indexRouter);

if (process.env.NODE_ENV === "production") {
	indexRouter.use(express.static(path.join(__dirname, "../client_build")));

	indexRouter.get("/", function (req, res) {
		res.sendFile(path.join(__dirname, "../client_build", "index.html"));
	});
}

indexRouter.use(redisExpressSession);

indexRouter.use("/api", apiRouter);

app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
