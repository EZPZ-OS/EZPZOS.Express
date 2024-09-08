import { UserRepository, RoleRepository, RoleCode, User, UserRole, Role } from "ezpzos.core";

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

	// Create and save a new user into database
	static async createUser(
		userData: Partial<User>
	): Promise<{ user: User | null; result: boolean; errorCode?: number; errorMessage?: string }> {
		try {
			// Create the user object with the provided data
			const userRepo = await this.getUserRepository();
			const user = new User();
			Object.assign(user, userData);
			user.Salt = "";
			user.IsDeleted = false;
			user.Avatar = "[binary,...,..]";

			// Save the user object to the database
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
			// Handle any exceptions that occur during the user creation and save process
			console.error(`Error during createAndSaveUser: ${error}`);
			return {
				user: null,
				result: false,
				errorCode: 500,
				errorMessage: "An unexpected error occurred during user creation"
			};
		}
	}

	// assign UserRole to a new user
	static async assignUserRole(user: User): Promise<UserRole | null> {
		try {
			const roleRepo = await this.getRoleRepository();
			let role = await roleRepo.GetRoleByCodePromise(RoleCode.User.toString());

			let userRole = new UserRole();
			userRole.Role = role ?? new Role();
			userRole.UserId = user.Id;
			userRole.RoleId = userRole.Role.Id;
			userRole.IsDeleted = false;

			user.UserRoles = [userRole];
			return userRole;
		} catch (error) {
			console.error(error);
			return null;
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
        throw new Error("User ID is required for updating");
      }
  
      const existingUser = await new Promise<User | null>((resolve, reject) => {
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
  
      // Save the updated user object to the database
      return new Promise((resolve) => {
        userRepo.Save(
          existingUser,
          existingUser.Id,
          true, // Indicating an update operation
          false,
          (result: boolean, errorCode?: number, errorMessage?: string) => {
            if (result) {
              // If the user is successfully saved, resolve with the updated user object and result
              resolve({ user: existingUser, result, errorCode: undefined, errorMessage: undefined });
            } else {
              // If there was an error saving the user, resolve with error details
              resolve({ user: null, result: false, errorCode, errorMessage });
            }
          }
        );
      });
    } catch (error) {
      // Handle any exceptions that occur during the user update process
      console.error(`Error during updateUser: ${error}`);
      return {
        user: null,
        result: false,
        errorCode: 500,
        errorMessage: "An unexpected error occurred during user update"
      };
    }
  }
}
