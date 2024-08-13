import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
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
	PhoneNumberNormalizer
} from "ezpzos.core";

dotenv.config();

const logger = new LogHandler("authController.ts");

interface SignupRequest extends Request {
	body: {
		mobile: string;
		otp?: string;
		username: string;
		email: string;
	};
}

interface LoginRequest extends Request {
	body: {
		mobile: string;
		otp?: string;
	};
}

const SECRET_KEY = DefaultJWTSecretKey;

//*Signup function
export const signup = async (req: SignupRequest, res: Response) => {
	let { mobile, username, email } = req.body;
	// Get the token from query parameters instead of URL params
	const otpToken = req.query.token as string;

	try {
		if (!mobile || !email || !username) {
			logger.Log("signup", "Missing required fields for user creation", LogLevel.WARN);
			return res.status(422).send("Missing required fields for user creation");
		}

		// Verify the token
		if (!otpToken) {
			logger.Log("signup", "JWT token is missing", LogLevel.WARN);
			return res.status(404).send("Authorization token is missing");
		}

		let decodedToken: JwtPayload;
		try {
			decodedToken = jwt.verify(otpToken, SECRET_KEY) as JwtPayload;
		} catch (err) {
			logger.Log("signup", "Invalid JWT token", LogLevel.WARN);
			return res.status(401).send("Invalid or expired token");
		}

		// Check if the token is expired
		const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
		if (decodedToken.exp && decodedToken.exp < currentTime) {
			logger.Log("signup", "JWT token has expired", LogLevel.WARN);
			return res.status(403).send("Token has expired");
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
	let { mobile } = req.body;

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

		//check if mobile is existed in database or not
		repo.GetUserByMobile(normalizedMobile, (result: boolean, user: User | null | undefined) => {
			if (!user) {
				logger.Log("login", "User not found", LogLevel.WARN);
				return res.status(404).send("User not found");
			}
			//generate jwt token and pass user back to frontend
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
