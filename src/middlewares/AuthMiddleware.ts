import { Request, Response, NextFunction } from "express";
import { DefaultJWTSecretKey } from "ezpzos.core";
import Jwt from "jsonwebtoken";

// Middleware function to check if the authToken is expired
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

	if (!token) {
		return res.status(401).json({ message: "Access Denied: No Token Provided" });
	}

	try {
		// Decode and verify the token
		const decoded = Jwt.verify(token, DefaultJWTSecretKey);
        
		// Check if the token is a JwtPayload and has an expiration time
		if (typeof decoded === "object" && "exp" in decoded) {
			// Check if the token is expired
			const currentTime = Math.floor(Date.now() / 1000);
			if (decoded.exp && decoded.exp < currentTime) {
				return res.status(403).json({ message: "Access Denied: Token Expired" });
			}
		} else {
			return res.status(401).json({ message: "Invalid Token" });
		}
		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		return res.status(401).json({ message: "Invalid Token" });
	}
};
export default verifyToken;
