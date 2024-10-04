import { Request, Response } from "express";
import { LogHandler, LogLevel, User } from "ezpzos.core";
import { UserService } from "../services/UserService";

const logger = new LogHandler("UserController.ts");

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
			return res.status(errorCode || 500).send({ result: false, message: errorMessage || "Error updating user" });
		}

		logger.Log("UpdateUser", "User successfully updated", LogLevel.INFO);
		return res.status(200).send({ result: true, user, message: "User successfully updated" });
	} catch (error) {
		logger.Log("UpdateUser", `Error during user update: ${error}`, LogLevel.ERROR);
		return res.status(500).send("An unexpected error occurred during user update. Please try again later.");
	}
};

export const UpdateAvatar = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const avatar = req.file;

	if (!userId) {
		logger.Log("UpdateAvatar", "User ID is missing", LogLevel.WARN);
		return res.status(400).send({ message: "User ID is required" });
	}

	if (!avatar) {
		logger.Log("UpdateAvatar", "Avatar file is missing", LogLevel.WARN);
		return res.status(400).send({ message: "Avatar file is required" });
	}

	try {
		await UserService.updateAvatar(userId, avatar);

		logger.Log("UpdateAvatar", "Avatar successfully updated", LogLevel.INFO);
		return res.status(200).send({ result: true, message: "Avatar successfully updated" });
	} catch (error) {
		if (error instanceof Error) {
			logger.Log("UpdateAvatar", `Error during avatar update: ${error.message}`, LogLevel.ERROR);
			return res.status(500).send("An unexpected error occurred during avatar update. Please try again later.");
		} else {
			logger.Log("UpdateAvatar", `Unexpected non-Error object thrown`, LogLevel.ERROR);
			return res.status(500).send("An unknown error occurred.");
		}
	}
};

export const getUserAvatar = async (req: Request, res: Response) => {
	const userId = req.params.id;

	if (!userId) {
		logger.Log("GetUserAvatar", "User ID is missing", LogLevel.WARN);
		return res.status(400).send({ message: "User ID is required" });
	}

	try {
		const userAvatar = await UserService.getUserAvatar(userId);

		if (userAvatar) {
			logger.Log("GetUserAvatar", "Avatar fetched successfully", LogLevel.INFO);
			res.set("Content-Type", "image/png"); // Set to PNG since only PNGs are allowed
			return res.status(200).send(userAvatar); // Directly send binary data
		} else {
			return res.status(404).send("Avatar not found");
		}
	} catch (error) {
		if (error instanceof Error) {
			logger.Log("GetUserAvatar", `Error during avatar fetching: ${error.message}`, LogLevel.ERROR);
			return res.status(500).send("An unexpected error occurred during avatar update. Please try again later.");
		} else {
			logger.Log("GetUserAvatar", `Unexpected non-Error object thrown`, LogLevel.ERROR);
			return res.status(500).send("An unknown error occurred.");
		}
	}
};
