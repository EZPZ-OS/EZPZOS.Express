import { UserRepository } from "ezpzos.core";

describe("Example Test", () => {
	it("should pass", () => {
		expect(true).toBe(true);
	});

	it("should not pass", () => {
		expect(true).toBe(false);
	});
});

// Jest Mocking
// The Execute function calls to db connection and return with data
// Thus needs to 'mock'(Override) this function to custom code so during testing, the db related code is not called.
const userRepositoryMock = jest
	// Mock only a function in the class
	.spyOn(UserRepository.prototype, "Execute")
	// mocking and override function
	.mockImplementation(async (query, dataobject, prepareParam, callback) => {
		// Other code if applicapable
		callback(undefined, undefined);
	});

describe("Example DB Test", () => {
	beforeEach(function () {
		userRepositoryMock.mockClear();
	});
	it("UserRepository GetUserById should return false and undefined if user not found ", async () => {
		let repo = new UserRepository();
		await repo.GetUserById("1", (result, user) => {
			expect(result).toBe(false);
			expect(user).toBe(undefined);
		});
		expect(userRepositoryMock).toHaveBeenCalled();
	});
});
