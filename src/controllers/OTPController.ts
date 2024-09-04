import { Request, Response } from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import {
	DefaultOTPVerificationValues,
	DefaultJWTSecretKey,
	OTPTokenExpiringPeriod,
	LogHandler,
	LogLevel,
	PhoneNumberNormalizer,
    OTPType
} from "ezpzos.core";

const logger = new LogHandler("OTPController");

interface SendOtpRequest extends Request {
	body: {
		mobile: string;
		otpType: string;
	};
}

interface VerifyOtpRequest extends Request {
	body: {
		mobile: string;
		otp: string;
		otpType: OTPType;
	};
}

const accountSid = DefaultOTPVerificationValues.AccountSidDefaultValue;
const authToken = DefaultOTPVerificationValues.AuthTokenDefaultValue;
const serviceSid = DefaultOTPVerificationValues.ServiceSidDefaultValue;
const client = twilio(accountSid, authToken);
const jwtSecret = DefaultJWTSecretKey;

export const sendOtp = async (req: SendOtpRequest, res: Response) => {
	const { mobile } = req.body;

	try {
		// Normalize the phone number
		const normalizer = new PhoneNumberNormalizer(mobile);
		const normalizedMobile = normalizer.normalize();

		// Send OTP using Twilio Verify service
		await client.verify.v2.services(serviceSid).verifications.create({ to: normalizedMobile, channel: "sms" });
		res.status(200).send({ message: "OTP sent successfully" });
	} catch (error) {
		logger.Log("send-otp", `Error sending OTP: ${error}`, LogLevel.ERROR);
		res.status(500).send("Error sending OTP");
	}
};

export const verifyOtp = async (req: VerifyOtpRequest, res: Response) => {
	const { mobile, otp, otpType } = req.body;

	try {
		// Normalize the phone number
		const normalizer = new PhoneNumberNormalizer(mobile);
		const normalizedMobile = normalizer.normalize();

		// Verify OTP using Twilio Verify service
		const verification_check = await client.verify.v2
			.services(serviceSid)
			.verificationChecks.create({ to: normalizedMobile, code: otp });

		if (verification_check.status === "approved") {
			// Create a JWT containing the otpType and mobile number
			const otpToken: string = jwt.sign({ mobile: normalizedMobile, otpType: otpType }, jwtSecret, {
				expiresIn: OTPTokenExpiringPeriod // Set expiration in seconds
			});

			// Calculate expiration time (in seconds since Unix epoch)
			const exp = Math.floor(Date.now() / 1000) + OTPTokenExpiringPeriod;

            // Create a navigation attribute depends on the otpType for frontend to react accordingly
			const otpTarget = otpType

			// Send the token and expiration time back to the client
			res.status(200).send({ message: "OTP verified successfully", otpToken, exp, otpTarget });
		} else {
			res.status(400).send("Invalid or expired OTP");
		}
	} catch (error) {
		logger.Log("verify-otp", `Error verifying OTP: ${error}`, LogLevel.ERROR);
		res.status(500).send("Error verifying OTP");
	}
};