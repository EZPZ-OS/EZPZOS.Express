import express, { Router } from "express";
import { mobileLogin, signup } from "../controllers/AuthController";
import verifyToken from "../middlewares/AuthMiddleware";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", mobileLogin);
router.get("/validate-token", verifyToken, (req, res) => {
    // If the token is valid, the middleware will pass control here
	res.status(200).json({ message: "Token is valid" });
});
export default router;
