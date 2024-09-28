import { Router } from "express";
import { CreateCuisine, GetAllCuisines, GetCuisineById, UpdateCuisine, DeleteCuisine } from './../../controllers/MenuController';

const router: Router = Router();

router.post("/create", CreateCuisine)
router.get("", GetAllCuisines)
router.get("/:id", GetCuisineById)
router.put("/:id", UpdateCuisine)
router.delete("/:id", DeleteCuisine)

export default router;