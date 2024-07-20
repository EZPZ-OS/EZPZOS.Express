import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getUserByMobile } from "../services/user.service";
import { DefaultJWTSecretKey, LogHandler, LogLevel } from "ezpzos.core";
import { client, serviceSid } from '../services/twilioService';
import { normalizePhoneNumber } from '../utils/phoneUtils';

dotenv.config();

const logger = new LogHandler("authController.ts");

interface LoginRequest extends Request {
	body: {
		mobile: string;
		otp?: string;
	};
}

const SECRET_KEY = process.env.JWT_SECRET ?? DefaultJWTSecretKey;

export const login = async (req: LoginRequest, res: Response) => {
	let { mobile, otp } = req.body;

  try {
	mobile = normalizePhoneNumber(mobile);
	
    if (!otp) {
      // No OTP provided, send OTP
      await client.verify.v2.services(serviceSid)
        .verifications
        .create({ to: mobile, channel: 'sms' });

      logger.Log('login', 'OTP sent successfully', LogLevel.INFO);
      return res.status(200).send('OTP sent successfully');
    } else {
      // OTP provided, verify it
      const verification_check = await client.verify.v2.services(serviceSid)
        .verificationChecks
        .create({ to: mobile, code: otp });

      if (verification_check.status === 'approved') {
        // Fetch the user by mobile number
        const user = await getUserByMobile(mobile);
        if (!user) {
          logger.Log('login', 'User not found', LogLevel.WARN);
          return res.status(404).send("User not found");
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.Id }, SECRET_KEY, {
          expiresIn: 86400 // expires in 24 hours
        });
        logger.Log('login', 'OTP verified successfully', LogLevel.INFO);
        return res.status(200).send({ auth: true, token });
      } else {
        logger.Log('login', 'Invalid or expired OTP', LogLevel.WARN);
        return res.status(400).send('Invalid or expired OTP');
      }
    }
  } catch (error) {
    logger.Log('login', `Error: ${error}`, LogLevel.ERROR);
    return res.status(500).send('Error during login');
  }
};
