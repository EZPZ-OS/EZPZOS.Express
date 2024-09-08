import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
	DefaultJWTSecretKey,
	LogHandler,
	LogLevel,
	User,
	JWTLoginTokenExpiringPeriod,
	PhoneNumberNormalizer,
	OTPType
} from "ezpzos.core";
import { verifyOtpToken } from "../services/AuthService";
import { UserService } from "../services/UserService";

dotenv.config();

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

const SECRET_KEY = DefaultJWTSecretKey;

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

		// Assign user role (e.g., "User")
		const userRole = await UserService.assignUserRole(user);
		if (!userRole) {
			logger.Log("signup", "Error assigning user role", LogLevel.ERROR);
			return res.status(500).send("Error assigning user role");
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
