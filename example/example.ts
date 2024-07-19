import { v4 } from "uuid";
import { User, UserRepository } from "ezpzos.core";

// Example 1 async callback
UserRepository().then(UserRepository => new UserRepository!.UserRepository().GetUserById("AFF71323-92EF-44DC-A6B9-DAC0FB63BF0B", (result, user) => {}));

// Example 2  await call
const UserRepositoryType = (await UserRepository())?.UserRepository;
if (!UserRepositoryType) {
	//return; End the function while you are using
}
const repo = new UserRepositoryType!();
let user = new User();
user.Id = v4();
user.Username = "test2";
user.Password = "test";
user.Email = "test";
user.IsDeleted = false;
user.Salt = "test";
user.Avatar = "test";
user.Mobile = "test";
user.CreatedTimestamp = new Date();
user.CreatedUserId = v4();
user.UpdatedTimestamp = new Date();
user.UpdatedUserId = v4();
console.log(user.Id);
// repo.Insert(user,(result)=>{
// 	console.log(result);

// });
repo.GetUserById("AFF71323-92EF-44DC-A6B9-DAC0FB63BF0B", (result, user) => {
	console.log(result);
});
