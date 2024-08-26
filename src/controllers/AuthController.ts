import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
	DefaultJWTSecretKey,
	LogHandler,
	LogLevel,
	UserRepository,
	User,
	RoleRepository,
	RoleCode,
	UserRole,
	Role,
	JWTLoginTokenExpiringPeriod,
	PhoneNumberNormalizer,
	OTPType
} from "ezpzos.core";
import { verifyOtpToken } from "../services/AuthService";

dotenv.config();

const logger = new LogHandler("authController.ts");

interface SignupRequest extends Request {
	body: {
		mobile: string;
		username: string;
		email: string;
		otpTarget: OTPType
	};
}

interface LoginRequest extends Request {
	body: {
		mobile: string;
		otpToken: string;
		otpTarget: OTPType
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

		//create a new user in database
		const userRepositoryType = (await UserRepository())?.UserRepository;
		if (!userRepositoryType) {
			logger.Log("signup", "UserRepositoryType is not defined", LogLevel.INFO);
			return res.status(500).send("An unexpected error occurred during sign-up. Please try again later.");
		}
		const userRepo = new userRepositoryType();

		const user = new User();
		user.Username = mobile;
		user.Password = "";
		user.Email = email;
		user.Mobile = normalizedMobile; // Use the normalized phone number to ensure consistency in format
		user.Salt = "";
		user.IsDeleted = false;
		user.Avatar = "[binary,...,..]";

		//create a new role in database
		const roleRepositoryType = (await RoleRepository())?.RoleRepository;
		if (!roleRepositoryType) {
			logger.Log("signup", "RoleRepositoryType is not defined", LogLevel.INFO);
			return res.status(500).send("An unexpected error occurred during sign-up. Please try again later.");
		}

		//assigning userRole as user(0)
		let role = await new roleRepositoryType().GetRoleByCodePromise(RoleCode.User.toString());

		let userRole = new UserRole();
		userRole.Role = role ?? new Role();
		userRole.UserId = user.Id;
		userRole.RoleId = userRole.Role.Id;
		userRole.IsDeleted = false;

		//link user's UserRole as the newly created userRole
		user.UserRoles = [userRole];

		//save user information into database
		userRepo.Save(user, user.Id, false, false, (result: boolean, errorCode?: number, errorMessage?: string) => {
			if (result) {
				const token = jwt.sign({ ...user }, SECRET_KEY, {
					expiresIn: JWTLoginTokenExpiringPeriod
				});
				logger.Log("signup", "User created successfully", LogLevel.INFO);
				res.status(201).send({ auth: true, token, message: "User created successfully" });
			} else {
				// Handle specific errors based on errorCode and errorMessage
				if (errorCode && errorMessage) {
					logger.Log("signup", errorMessage, LogLevel.WARN);
					return res.status(errorCode).send({ auth: false, message: errorMessage });
				}
			}
		});
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

		const userRepositoryType = (await UserRepository())?.UserRepository;
		if (!userRepositoryType) {
			logger.Log("signup", "UserRepositoryType is not defined", LogLevel.INFO);
			return res.status(500).send("An unexpected error occurred during sign-up. Please try again later.");
		}
		const repo = new userRepositoryType();

		// Check if mobile exists in the database
		repo.GetUserByMobile(normalizedMobile, (result: boolean, user: User | null | undefined, errorCode?: number, errorMessage?: string) => {
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
			return res.status(200).send({ auth: true, token, message: "User login successfully" });
		});
	} catch (err) {
		logger.Log("login", `Error: ${err}`, LogLevel.ERROR);
		return res.status(500).send("Error during login");
	}
};
