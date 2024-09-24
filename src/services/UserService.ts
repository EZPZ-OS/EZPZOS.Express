import { RoleCode, RoleRepository, User, UserRepository, UserRole, UserRoleRepository } from "ezpzos.core";
import prisma from "./PrismaService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UpdateUser, User as UserType } from "../types/User";

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
			user.Avatar = "[binary,...,..]";

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

	//update existed user in the database
	static async updateUser(
		userData: Partial<User>
	): Promise<{ user: User | null; result: boolean; errorCode?: number; errorMessage?: string }> {
		try {
			const userRepo = await this.getUserRepository();

			// Retrieve the existing user from the database
			if (!userData.Id) {
				return { user: null, result: false, errorCode: 404, errorMessage: "User ID is required for updating" };
			}

			const existingUser = await new Promise<User | null>(resolve => {
				userRepo.GetUserById(userData.Id!, (result: boolean, user: User | null | undefined) => {
					if (result && user) {
						resolve(user);
					} else {
						resolve(null);
					}
				});
			});

			if (!existingUser) {
				return {
					user: null,
					result: false,
					errorCode: 404,
					errorMessage: "User not found"
				};
			}

			// Merge the updated fields into the existing user
			Object.assign(existingUser, userData);

			const user = new User();
			Object.assign(user, existingUser);
			user.Avatar = "[binary,...,..]";

			return new Promise(resolve => {
				userRepo.Save(
					user,
					user.Id,
					true, // Indicating an update operation
					false,
					(result: boolean, errorCode?: number, errorMessage?: string) => {
						if (result) {
							// If the user is successfully saved, resolve with the updated user object and result
							resolve({ user: user, result, errorCode: undefined, errorMessage: undefined });
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
				errorMessage: "An unexpected error occurred during user update"
			};
		}
	}

	// TODO Remove this function after testing and confirming prisma adoption
	static async updateUserTest(userId: string, userData: UpdateUser): Promise<UserType> {
		try {
			return await prisma.user.update({
				where: {
					Id: userId,
				},
				data: { ...userData },
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// Handle specific Prisma errors (e.g., database connection issues)
				console.error("Prisma error:", error.message)
				throw new Error("Error fetching users from database")
			} else {
				// Handle generic errors
				console.error("Unexpected error:", error)
				throw new Error("Something went wrong while fetching users")
			}
		}
	}

	// TODO Remove this function after testing and confirming prisma adoption
	static async getUsers(): Promise<UserType[]> {
		try {
			return await prisma.user.findMany()
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// Handle specific Prisma errors (e.g., database connection issues)
				console.error("Prisma error:", error.message)
				throw new Error("Error fetching users from database")
			} else {
				// Handle generic errors
				console.error("Unexpected error:", error)
				throw new Error("Something went wrong while fetching users")
			}
		}
	}
}
