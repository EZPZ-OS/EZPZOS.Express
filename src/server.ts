// File: src/index.ts
import express, { Express, Request, Response } from 'express';
import { LogHandler, LogLevel, DefaultPortNumber} from 'ezpzos.core';
import dotenv from 'dotenv';
import cors from 'cors';
import { privateRouter, publicRouter } from './routes/routes';

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || DefaultPortNumber;
const app: Express = express();
app.use(express.json());

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.redirect('/health-check');
});

app.get("/health-check", (req: Request, res: Response) => {
    res.send("ok");
});

app.use('/public', publicRouter);
app.use('/private', privateRouter);

app.listen(port, () => {
    new LogHandler('server.ts').Log('app.listen', `now listening on port ${port}`, LogLevel.INFO);
});
