// File: src/routes/otp.ts
import express, { Request, Response, Router } from 'express';
import { ConnectionPool, Request as SqlRequest, config as SqlConfig } from 'mssql';
import twilio from 'twilio';
import * as dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();

const accountSidDefaultValue = 'AC63e06f89a641026e2cc4045d7c27082e';
const authTokenDefaultValue = '508a6e0fdfe4aca8d6575d1fc2b6be02';
const serviceSidDefaultValue = 'VA341cf7d3ecf7ff33274231890ba72d75';


const accountSid = process.env.TWILIO_ACCOUNT_SID || accountSidDefaultValue; 
const authToken = process.env.TWILIO_AUTH_TOKEN || authTokenDefaultValue; 
const serviceSid = process.env.TWILIO_SERVICE_SID || serviceSidDefaultValue;
const client = twilio(accountSid, authToken);

//console.log(`Service SID: ${serviceSid}`);

const dbConfig: SqlConfig = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || '',
    database: process.env.DB_NAME || '',
    options: {
        encrypt: true,
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
    }
};

const pool = new ConnectionPool(dbConfig);

pool.connect().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection failed: ', err);
});

interface SendOtpRequest extends Request {
    body: {
        mobile: string;
    };
}

interface VerifyOtpRequest extends Request {
    body: {
        mobile: string;
        otp: string;
    };
}

router.post('/send-otp', async (req: SendOtpRequest, res: Response) => {
    const { mobile } = req.body;

    try {
        // Send OTP using Twilio Verify service
        await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: mobile, channel: 'sms' });

        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Error sending OTP');
    }
});

router.post('/verify-otp', async (req: VerifyOtpRequest, res: Response) => {
    const { mobile, otp } = req.body;

    try {
        // Verify OTP using Twilio Verify service
        const verification_check = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: mobile, code: otp });

        if (verification_check.status === 'approved') {
            res.status(200).send('OTP verified successfully');
        } else {
            res.status(400).send('Invalid or expired OTP');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Error verifying OTP');
    }
});

export default router;
