import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { DefaultJWTSecretKey, LogHandler, LogLevel, UserRepository, User, RoleRepository, RoleCode, UserRole, Role, JWTTokenExpiringPeriod } from "ezpzos.core";

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

	try {
		if (!mobile || !email || !username) {
			logger.Log("signup", "Missing required fields for user creation", LogLevel.WARN);
			return res.status(422).send("Missing required fields for user creation");
		}
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
		user.Mobile = mobile;
		user.Salt = "";
		user.IsDeleted=false;
		user.Avatar = "[binary,...,..]";

		const roleRepositoryType = (await RoleRepository())?.RoleRepository;
		if (!roleRepositoryType) {
			logger.Log("signup", "RoleRepositoryType is not defined", LogLevel.INFO);
			return res.status(500).send("An unexpected error occurred during sign-up. Please try again later.");
		}

		let role = await new roleRepositoryType().GetRoleByCodePromise(RoleCode.User.toString());

		let userRole = new UserRole();
		userRole.Role = role ?? new Role();
		userRole.UserId = user.Id;
		userRole.RoleId = userRole.Role.Id
		userRole.IsDeleted = false

		user.UserRoles = [userRole];

		userRepo.Save(user, user.Id, false, false, (result: boolean) => {
			if (result) {				
				const token = jwt.sign({ ...user }, SECRET_KEY, {
					expiresIn: JWTTokenExpiringPeriod
				});
				logger.Log("signup", "User created successfully", LogLevel.INFO);
				res.status(201).send({ auth: true, token, message: "User created successfully" });
			} else {
				logger.Log("signup", "Invalid or expired OTP", LogLevel.WARN);
				return res.status(400).send("Invalid or expired OTP");
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
		const userRepositoryType = (await UserRepository())?.UserRepository;
		if (!userRepositoryType) {
			logger.Log("signup", "UserRepositoryType is not defined", LogLevel.INFO);
			return res.status(500).send("An unexpected error occurred during sign-up. Please try again later.");
		}
		const repo = new userRepositoryType();

		repo.GetUserByMobile(mobile, (result: boolean, user: User | null | undefined) => {
			if (!user) {
				logger.Log("login", "User not found", LogLevel.WARN);
				return res.status(404).send("User not found");
			}
			//generate jwt token and pass userId and userRole back to frontend
			const token = jwt.sign({ ...user }, SECRET_KEY, {
				expiresIn: JWTTokenExpiringPeriod
			});
			logger.Log("login", "OTP verified successfully", LogLevel.INFO);
			return res.status(200).send({ auth: true, token, message: "User login successfully" });
		});
	} catch (err) {
		logger.Log("login", `Error: ${err}`, LogLevel.ERROR);
		return res.status(500).send("Error during login");
	}
};
