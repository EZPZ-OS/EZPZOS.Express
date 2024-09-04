import express, { Router } from "express";
import { PostBooking } from "../controllers/AuthController";

const router: Router = express.Router();

router.post("/addnew", PostBooking);

export default router;
