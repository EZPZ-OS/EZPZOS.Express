import express, { Express, Request, Response } from "express";
import { LogHandler } from "ezpzos.core";
import { LogLevel } from "ezpzos.core/src/Common/Constants";
const port = 8000;

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
	res.send("HELLO, this is now running");
});

app.get("/hi", (req: Request, res: Response) => {
	res.send("Worked!");
});

app.listen(port, () => {
	new LogHandler("server.ts").Log("app.listen", `now listening on port ${port}`, LogLevel.INFO);
});
