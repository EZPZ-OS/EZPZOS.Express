import { RoleCode, RoleRepository, User, UserRepository, UserRole, UserRoleRepository } from "ezpzos.core";
import prisma from "./PrismaService";
import { User as UserType } from "../types/User";

export class UserService {
	// Utility method to get user repository
	static async getUserRepository() {
		const userRepositoryType = (await UserRepository())?.UserRepository;
		if (!userRepositoryType) {
			throw new Error("UserRepository is not defined");
		}
		return new userRepositoryType();
	}

	// Utility method to get role repository
	static async getRoleRepository() {
		const roleRepositoryType = (await RoleRepository())?.RoleRepository;
		if (!roleRepositoryType) {
			throw new Error("RoleRepository is not defined");
		}
		return new roleRepositoryType();
	}

	static async getUserRoleRepository() {
		const userRoleRepositoryType = (await UserRoleRepository())?.UserRoleRepository;
		if (!userRoleRepositoryType) {
			throw new Error("UserRoleRepository is not defined");
		}
		return new userRoleRepositoryType();
	}

	// Create and save a new user into the database, and assign a role before saving
	static async createUser(
		userData: Partial<User>
	): Promise<{ user: User | null; result: boolean; errorCode?: number; errorMessage?: string }> {
		try {
			// Create the user object with the provided data
			const userRepo = await this.getUserRepository();
			const roleRepo = await this.getRoleRepository();

			const user = new User();
			Object.assign(user, userData);
			user.Salt = "";
			user.IsDeleted = false;
			user.Avatar = "";

			// Assign a user role before saving the user
			const role = await roleRepo.GetRoleByCodePromise(RoleCode.User.toString());
			if (!role) {
				return { user: null, result: false, errorCode: 500, errorMessage: "User role not found" };
			}

			// Create a new UserRole and associate it with the user
			const userRole = new UserRole();
			userRole.RoleId = role.Id;
			userRole.Role = role;
			userRole.UserId = user.Id; // Assign the userId to the userRole
			userRole.IsDeleted = false;

			// Assign the UserRole to the user object before saving
			user.UserRoles = [userRole]; // Assign roles to user before saving

			// Save the user object along with the UserRole to the database
			return new Promise(resolve => {
				userRepo.Save(
					user,
					user.Id,
					false,
					false,
					(result: boolean, errorCode?: number, errorMessage?: string) => {
						if (result) {
							// If the user is successfully saved, resolve with the user object and result
							resolve({ user, result, errorCode: undefined, errorMessage: undefined });
						} else {
							// If there was an error saving the user, resolve with error details
							resolve({ user: null, result: false, errorCode, errorMessage });
						}
					}
				);
			});
		} catch (error) {
			return {
				user: null,
				result: false,
				errorCode: 500,
				errorMessage: "An unexpected error occurred during user creation"
			};
		}
	}

	static async getUserByMobile(mobile: string): Promise<UserType> {
		const user = await prisma.user.findUnique({
			where: { Mobile: mobile },
			select: {
				Id: true,
				Username: true,
				Password: true,
				Salt: true,
				Email: true,
				Mobile: true,
				IsDeleted: true,
				CreatedTimestamp: true,
				CreatedUserId: true,
				UpdatedTimestamp: true,
				UpdatedUserId: true
			}
		});
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	static async updateUser(userId: string, userData: Partial<User>) {
		try {
		  const updatedUser = await prisma.user.update({
			where: { Id: userId },
			data: {
			  Username: userData.Username,
			  Email: userData.Email,
			  Mobile: userData.Mobile,
			},
		  });
		  return { user: updatedUser, result: true };
		} catch (error) {
		  console.error("Error updating user: ", error);
		  return { user: null, result: false, errorMessage: "Error updating user." };
		}
	  }

	static async updateAvatar(userId: string, avatar: Express.Multer.File) {
		// Update the user's avatar in the database as binary data
		return prisma.user.update({
			where: { Id: userId },
			data: {
				Avatar: avatar.buffer
			}
		});
	}

	static async getUserAvatar(userId: string): Promise<Buffer | null> {
		// Fetch the user's avatar from the database
		const user = await prisma.user.findUnique({
			where: { Id: userId },
			select: { Avatar: true }
		});

		if (!user) {
			throw new Error("User not found");
		}

		return user.Avatar;
	}
}
