import { Request, Response, NextFunction } from "express";
import { DefaultJWTSecretKey } from "ezpzos.core";

const jwt = require('jsonwebtoken');

// Middleware function to check if the authToken is expired
const verifyToken = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, DefaultJWTSecretKey);

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            return res.status(401).json({ message: 'Access Denied: Token Expired' });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};
export default verifyToken;