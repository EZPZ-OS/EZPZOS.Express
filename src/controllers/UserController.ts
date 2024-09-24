import { Request, Response } from "express";
import { LogHandler, LogLevel, User } from "ezpzos.core";
import { UserService } from "../services/UserService";

const logger = new LogHandler("userController.ts");

interface UpdateUserRequest extends Request {
	body: Partial<User>;
}

export const UpdateUser = async (req: UpdateUserRequest, res: Response) => {
	const userUpdates = req.body;

	// Extract user ID from the request parameters
	const userId = req.params.id;

	// Check if userUpdates.Id is provided
	if (!userId && !userUpdates.Id) {
		logger.Log("UpdateUser", "User ID is missing", LogLevel.WARN);
		return res.status(400).send({ message: "User ID is required" });
	}

	// If the ID is not in the body, assign it from params
	userUpdates.Id = userUpdates.Id || userId;

	try {
		// Use the UserService to update the user
		const { user, result, errorCode, errorMessage } = await UserService.updateUser(userUpdates);

		if (!result) {
			logger.Log("UpdateUser", errorMessage || "Error updating user", LogLevel.WARN);
			return res.status(errorCode || 500).send({ result:false, message: errorMessage || "Error updating user" });
		}

		logger.Log("UpdateUser", "User successfully updated", LogLevel.INFO);
		return res.status(200).send({ result:true, user, message: "User successfully updated" });
	} catch (error) {
		logger.Log("UpdateUser", `Error during user update: ${error}`, LogLevel.ERROR);
		return res.status(500).send("An unexpected error occurred during user update. Please try again later.");
	}
};

// Test prisma update
//TODO: Remove this function or UpdateUser function after testing and confirming prisma adoption
export const UpdateUserTest = async (req: Request, res: Response) => {
	const userUpdateObject = req.body;

	// Extract user ID from the request parameters
	const userId = req.params.id;

	// Check if userUpdates.Id is provided
	if (!userId) {
		logger.Log("UpdateUser", "User ID is missing", LogLevel.WARN);
		return res.status(400).send({ message: "User ID is required" });
	}

	try {
		// Use the UserService to update the user
		const user = await UserService.updateUserTest(userId, userUpdateObject);

		logger.Log("UpdateUser", "User successfully updated", LogLevel.INFO);
		return res.status(200).send({ result:true, user, message: "User successfully updated" });
	} catch (error) {
		logger.Log("UpdateUser", `Error during user update: ${error}`, LogLevel.ERROR);
		return res.status(500).send("An unexpected error occurred during user update. Please try again later.");
	}
};

// Test prisma get
//TODO: Remove this function after testing and confirming prisma adoption
export const GetUsers = async (req: Request, res: Response) => {
	try {
		const users = await UserService.getUsers();
		return res.status(200).send({ result:true, users, message: "Users fetched successfully." });
	} catch (error) {
		logger.Log("GetUsers", `Error fetching users: ${error}`, LogLevel.ERROR);
		return res.status(500).send("An unexpected error occurred fetching users. Please try again later.");
	}
};
