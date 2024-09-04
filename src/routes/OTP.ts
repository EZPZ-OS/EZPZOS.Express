import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/OTPController";

const router: Router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;