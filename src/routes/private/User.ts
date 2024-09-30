import { Router } from "express";
import { GetUsers, UpdateUser, UpdateUserTest } from "../../controllers/UserController";

const router: Router = Router();

router.put("/update/:id", UpdateUser)

//TODO: Remove these 2 route after testing and confirming prisma adoption
router.put("/updateTest/:id", UpdateUserTest)
router.get("", GetUsers)

export default router;