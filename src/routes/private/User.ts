import { Router } from "express";
import { getUserAvatar,UpdateAvatar, UpdateUser } from "../../controllers/UserController";
import { uploadImageMiddleware } from './../../middlewares/UploadImageMiddleware';

const router: Router = Router();

router.put("/:id", UpdateUser)
router.put("/:id/avatar", uploadImageMiddleware, UpdateAvatar);
router.get("/:id/avatar", getUserAvatar);

export default router;