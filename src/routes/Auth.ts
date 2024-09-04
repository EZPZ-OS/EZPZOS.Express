import express, { Router } from "express";
import { mobileLogin, signup } from "../controllers/AuthController";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", mobileLogin);

export default router;
