import { Router } from "express";
import { mobileLogin, signup, sendOtp, verifyOtp, adminLogin } from "../controllers/AuthController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import BookingRouter from "./private/Booking";
import UserRouter from "./private/User";
import MenuRouter from "./private/Menu"

/* -- Public Router -- */
const publicRouter: Router = Router();
publicRouter.post("/login", mobileLogin);
publicRouter.post("/login/admin", adminLogin);
publicRouter.post("/signup", signup);
publicRouter.post("/send-otp", sendOtp);
publicRouter.post("/verify-otp", verifyOtp);

/* -- Private Router -- */
const privateRouter: Router = Router();
privateRouter.use(AuthMiddleware);

// Define private routes
privateRouter.use("/booking", BookingRouter);
privateRouter.use("/user", UserRouter);
privateRouter.use("/menu", MenuRouter)

export { publicRouter, privateRouter };
