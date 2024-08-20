import express, { Request, Response, Router } from "express";
import twilio from "twilio";
import * as dotenv from "dotenv";
import {
	DefaultOTPVerificationValues,
	DefaultJWTSecretKey,
	JWTOTPTokenExpiringPeriod,
	LogHandler,
	LogLevel,
	PhoneNumberNormalizer
} from "ezpzos.core";
import jwt from "jsonwebtoken";

dotenv.config();

const router: Router = express.Router();

const logger = new LogHandler("otp.ts");

const accountSid = DefaultOTPVerificationValues.AccountSidDefaultValue;
const authToken = DefaultOTPVerificationValues.AuthTokenDefaultValue;
const serviceSid = DefaultOTPVerificationValues.ServiceSidDefaultValue;

const client = twilio(accountSid, authToken);
const jwtSecret = DefaultJWTSecretKey;
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

router.post("/send-otp", async (req: SendOtpRequest, res: Response) => {
	const { mobile } = req.body;

	try {
		// Normalize the phone number
		const normalizer = new PhoneNumberNormalizer(mobile);
		const normalizedMobile = normalizer.normalize();
		// Send OTP using Twilio Verify service
		await client.verify.v2.services(serviceSid).verifications.create({ to: normalizedMobile, channel: "sms" });
		res.status(200).send("OTP sent successfully");
	} catch (error) {
		logger.Log("send-otp", `Error sending OTP: ${error}`, LogLevel.ERROR);
		res.status(500).send("Error sending OTP");
	}
});

router.post("/verify-otp", async (req: VerifyOtpRequest, res: Response) => {
	const { mobile, otp } = req.body;

	try {
		// Normalize the phone number
		const normalizer = new PhoneNumberNormalizer(mobile);
		const normalizedMobile = normalizer.normalize();

		// Verify OTP using Twilio Verify service
		const verification_check = await client.verify.v2
			.services(serviceSid)
			.verificationChecks.create({ to: normalizedMobile, code: otp });

		if (verification_check.status === "approved") {
			// Create a JWT containing the UUID and mobile number
			const otpToken: string = jwt.sign({ mobile: normalizedMobile }, jwtSecret, {
				expiresIn: JWTOTPTokenExpiringPeriod // Set expiration in seconds
			});

			// Calculate expiration time (in seconds since Unix epoch)
			const exp = Math.floor(Date.now() / 1000) + JWTOTPTokenExpiringPeriod;

			// Send the token and expiration time back to the client
			res.status(200).send({ message: "OTP verified successfully", otpToken, exp });
		} else {
			res.status(400).send("Invalid or expired OTP");
		}
	} catch (error) {
		logger.Log("verify-otp", `Error verifying OTP: ${error}`, LogLevel.ERROR);
		res.status(500).send("Error verifying OTP");
	}
});

export default router;
