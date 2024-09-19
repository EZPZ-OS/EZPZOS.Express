import { Router } from "express";
import { UpdateUser } from "../../controllers/UserController";

const router: Router = Router();

router.put("/update/:id", UpdateUser)

export default router;