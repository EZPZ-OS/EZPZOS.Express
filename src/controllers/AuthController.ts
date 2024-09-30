import { Request, Response } from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import {
	DefaultJWTSecretKey,
	LogHandler,
	LogLevel,
	User,
	JWTLoginTokenExpiringPeriod,
	PhoneNumberNormalizer,
	OTPType,
	DefaultOTPVerificationValues,
	OTPTokenExpiringPeriod,
} from "ezpzos.core";
import { verifyOtpToken } from "../services/AuthService";
import { UserService } from "../services/UserService";

const logger = new LogHandler("authController.ts");

interface SignupRequest extends Request {
	body: {
		mobile: string;
		username: string;
		email: string;
		otpTarget: OTPType;
	};
}

interface LoginRequest extends Request {
	body: {
		mobile: string;
		otpToken: string;
		otpTarget: OTPType;
	};
}

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

const accountSid = process.env.ACCOUNT_SID ?? DefaultOTPVerificationValues.AccountSidDefaultValue;
const authToken = process.env.AUTH_TOKEN ?? DefaultOTPVerificationValues.AuthTokenDefaultValue;
const serviceSid = process.env.SERVICE_SID ?? DefaultOTPVerificationValues.ServiceSidDefaultValue;
const client = twilio(accountSid, authToken);

const SECRET_KEY = DefaultJWTSecretKey;

//*Sending OTP function
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

//*Verifying OTP function
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
			const otpToken: string = jwt.sign({ mobile: normalizedMobile, otpType: otpType }, SECRET_KEY, {
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

//*Signup function
export const signup = async (req: SignupRequest, res: Response) => {
	let { mobile, username, email, otpTarget } = req.body;

	// Get the token from query parameters
	const otpToken = req.query.token as string;

	// Verify the token and otpType
	if (!verifyOtpToken(otpToken, SECRET_KEY, otpTarget, res)) return;

	try {
		if (!mobile || !email || !username) {
			logger.Log("signup", "Missing required fields for user creation", LogLevel.WARN);
			return res.status(422).send("Missing required fields for user creation");
		}

		// Normalize the phone number
		const normalizer = new PhoneNumberNormalizer(mobile);
		const normalizedMobile = normalizer.normalize();

		// Use UserService to create and save the user
		const { user, result, errorCode, errorMessage } = await UserService.createUser({
			Username: mobile,
			Password: "",
			Email: email,
			Mobile: normalizedMobile
		});

		if (!result || !user) {
			logger.Log("signup", `Error: ${errorMessage}`, LogLevel.ERROR);
			return res.status(errorCode || 500).send({ message: errorMessage || "Error creating user" });
		}

		// Generate JWT token
		const token = jwt.sign({ ...user }, SECRET_KEY, { expiresIn: JWTLoginTokenExpiringPeriod });

		logger.Log("signup", "User created successfully", LogLevel.INFO);
		return res.status(201).send({ auth: true, token, user, message: "User created successfully" });
	} catch (err) {
		logger.Log("signup", `Error during sign-up: ${err}`, LogLevel.ERROR);
		return res.status(500).send("An unexpected error occurred during sign-up. Please try again later.");
	}
};

//*Login by mobile function
export const mobileLogin = async (req: LoginRequest, res: Response) => {
	let { mobile, otpToken, otpTarget } = req.body;

	// Verify the token and otpType
	if (!verifyOtpToken(otpToken, SECRET_KEY, otpTarget, res)) return;

	try {
		// Normalize the phone number
		const normalizer = new PhoneNumberNormalizer(mobile);
		const normalizedMobile = normalizer.normalize();

		const repo = await UserService.getUserRepository();

		// Check if mobile exists in the database
		repo.GetUserByMobile(
			normalizedMobile,
			(result: boolean, user: User | null | undefined, errorCode?: number, errorMessage?: string) => {
				if (!result || !user) {
					const status = errorCode || 404;
					const message = errorMessage || "User not found";
					logger.Log("login", "User not found", LogLevel.WARN);
					return res.status(status).send({ error: message });
				}
				// Generate jwt token and pass user back to frontend
				const token = jwt.sign({ ...user }, SECRET_KEY, {
					expiresIn: JWTLoginTokenExpiringPeriod
				});
				logger.Log("login", "OTP verified successfully", LogLevel.INFO);
				return res.status(200).send({ auth: true, token, user, message: "User login successfully" });
			}
		);
	} catch (err) {
		logger.Log("login", `Error: ${err}`, LogLevel.ERROR);
		return res.status(500).send("Error during login");
	}
};
