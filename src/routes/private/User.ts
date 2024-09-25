import { Router } from "express";
import { getUserAvatar, GetUsers, UpdateAvatar, UpdateUser, UpdateUserTest } from "../../controllers/UserController";

const router: Router = Router();

router.put("/update/:id", UpdateUser)
router.put("/:id/avatar", UpdateAvatar);
router.get("/:id/avatar", getUserAvatar);

//TODO: Remove these 2 route after testing and confirming prisma adoption
router.put("/updateTest/:id", UpdateUserTest)
router.get("", GetUsers)

export default router;