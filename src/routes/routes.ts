import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/OTPController";
import { mobileLogin, signup } from "../controllers/AuthController";
import AuthMiddleware from "../middlewares/AuthMiddleware"
import BookingRouter from "./private/Booking";
import UserRouter from "./private/User";

/* -- Public Router -- */
const publicRouter: Router = Router();
publicRouter.post("/login", mobileLogin);
publicRouter.post("/signup", signup);
publicRouter.post("/send-otp", sendOtp);
publicRouter.post("/verify-otp", verifyOtp);

/* -- Private Router -- */
const privateRouter: Router = Router();
privateRouter.use(AuthMiddleware);

// Define private routes
privateRouter.use("/booking", BookingRouter);
privateRouter.use("/user", UserRouter);


export { publicRouter, privateRouter }