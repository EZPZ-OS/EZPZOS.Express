import { v4 } from "uuid";
import { User, UserRepository } from "ezpzos.core";

let repo = new UserRepository();
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
