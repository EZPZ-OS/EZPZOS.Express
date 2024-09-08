import { Request, Response } from "express";
import { LogHandler, LogLevel, User } from "ezpzos.core";
import { UserService } from "../services/UserService";

const logger = new LogHandler("userController.ts");

interface UpdateUserRequest extends Request {
	body: {
		user: Partial<User>;
	};
}

export const UpdateUser = async (req: UpdateUserRequest, res: Response) => {
	const { user: userUpdates } = req.body;
  
	// Check if userUpdates.Id is provided
	if (!userUpdates.Id) {
	  logger.Log("UpdateUser", "User ID is missing", LogLevel.WARN);
	  return res.status(400).send({ message: "User ID is required" });
	}
  
	try {
	  // Use the UserService to update the user
	  const { user, result, errorCode, errorMessage } = await UserService.updateUser(userUpdates);
  
	  if (!result) {
		logger.Log("UpdateUser", errorMessage || "Error updating user", LogLevel.WARN);
		return res.status(errorCode || 500).send({ message: errorMessage || "Error updating user" });
	  }
  
	  logger.Log("UpdateUser", "User successfully updated", LogLevel.INFO);
	  return res.status(200).send({ user, message: "User successfully updated" });
  
	} catch (error) {
	  logger.Log("UpdateUser", `Error during user update: ${error}`, LogLevel.ERROR);
	  return res.status(500).send("An unexpected error occurred during user update. Please try again later.");
	}
  };
