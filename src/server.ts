// File: src/index.ts
import express, { Express, Request, Response } from 'express';
import { LogHandler, LogLevel, DefaultPortNumber} from 'ezpzos.core';
import otpRouter from './routes/OTP';
import authRouter from './routes/Auth'; // Import the auth routes
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || DefaultPortNumber;
const app: Express = express();
app.use(express.json());

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('HELLO, this is now running');
});

app.get('/hi', (req: Request, res: Response) => {
    res.send('Worked!');
});

app.use('/otp', otpRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    new LogHandler('server.ts').Log('app.listen', `now listening on port ${port}`, LogLevel.INFO);
});
