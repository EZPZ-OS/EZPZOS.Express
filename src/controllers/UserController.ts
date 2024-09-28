import { Request, Response, NextFunction } from "express";
import { LogHandler, LogLevel, User } from "ezpzos.core";
import { UserService } from "../services/UserService";
import multer from "multer";

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

export const UpdateAvatar = [
	// Multer setup within the function for handling file uploads
	(req: Request, res: Response, next: NextFunction) => {
		const upload = multer({
			storage: multer.memoryStorage(),
			fileFilter: (req, file, cb) => {
				if (file.mimetype !== 'image/png') {
					logger.Log("UpdateAvatar", "Only PNG files are allowed", LogLevel.WARN);
					return cb(null, false); // Reject the file
				}
				cb(null, true); // Accept the file
			},
		}).single('avatar');

		upload(req, res, function (err) {
			if (err) {
				logger.Log("UpdateAvatar", `Multer Error: ${err.message}`, LogLevel.ERROR);
				return res.status(400).send({ message: "File upload failed. Only PNG files are allowed.", error: err.message });
			}
			next();  // Pass control to the next middleware (the main avatar update logic)
		});
	},

	// Main controller logic to update the avatar
	async (req: Request, res: Response) => {
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
	}
];

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
			res.set('Content-Type', 'image/png'); // Set to PNG since only PNGs are allowed
			return res.status(200).send(userAvatar); // Directly send binary data
		} else {
			return res.status(404).send('Avatar not found');
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
