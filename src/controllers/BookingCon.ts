import { Request, Response } from "express";
import {
	LogLevel,
	PhoneNumberNormalizer,
    OTPType
} from "ezpzos.core";

export const PostBooking = async (req: SendOtpRequest, res: Response) => {
	const { cai, price, shuliang } = req.body;

	try {
		const BookingModel = { cai, price, shuliang };
        const data = BookingService.AddNewBooking(BookingModel)
		res.status(200).send(data);
	} catch (error) {
		logger.Log("send-otp", `Error sending OTP: ${error}`, LogLevel.ERROR);
		res.status(500).send("Error sending OTP");
	}
};