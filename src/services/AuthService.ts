import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';
import { LogHandler, LogLevel, OTPType } from 'ezpzos.core'; 

const logger = new LogHandler("AuthService");

// Checking if signup or login request contain a valid otpToken
export const verifyOtpToken = (
    otpToken: string | undefined,
    SECRET_KEY: string,
    otpTarget: OTPType,
    res: Response
): boolean => {
    if (!otpToken) {
        logger.Log("AuthService", "JWT token is missing", LogLevel.WARN);
        res.status(404).send("Authorization token is missing");
        return false;
    }

    // Verify if otpToken is valid
    let decodedToken: JwtPayload;
    try {
        decodedToken = jwt.verify(otpToken, SECRET_KEY) as JwtPayload;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            logger.Log("AuthService", "JWT token has expired", LogLevel.WARN);
            res.status(403).send("Token has expired");
        } else {
            logger.Log("AuthService", "Invalid JWT token", LogLevel.WARN);
            res.status(401).send("Invalid token");
        }
        return false;
    }

     // Convert the extracted otpType to OTPType enum
     const otpTypeFromToken = decodedToken.otpType as OTPType;

     // Check if the token's otpType matches otpTarget to verify purpose (signup || login)
     if (otpTypeFromToken === otpTarget) {
         logger.Log("AuthService", "OTP type matches target.", LogLevel.INFO);
         return true;
    } else {
        logger.Log("AuthService", "OTP type does not match target.", LogLevel.WARN);
        res.status(400).send("Invalid OTP type for this operation.");
        return false;
    }
};