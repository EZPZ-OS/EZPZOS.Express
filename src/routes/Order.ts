import express, { Request, Response, Router } from "express";
import { LogHandler, LogLevel, Order, OrderRepository, ResponseCode } from "ezpzos.core";
import { ResponseHandler } from "../Handler/ResponseHandler";

const router: Router = express.Router();

const logger = new LogHandler("Order.ts");

interface OrderPostRequest extends Request {
	body: {
		order: Order;
		userId?: string;
	};
}

router.post("/", async (req: OrderPostRequest, res: Response) => {
	const { order, userId } = req.body;

	try {
		let parsedInOrder = new Order(LogLevel.DEBUG, order);
		if (!order) {
			logger.Log("post", "Cannot find order from the body", LogLevel.ERROR);
			ResponseHandler.formatResponse(
				res,
				Number(ResponseCode.BAD_REQUEST_PARAMETERS),
				"Cannot find order from the body",
				null
			);
			return;
		}

		if (!userId) {
			logger.Log("post", "Cannot find userId from the body", LogLevel.ERROR);
			ResponseHandler.formatResponse(
				res,
				Number(ResponseCode.BAD_REQUEST_PARAMETERS),
				"Cannot find userId from the body",
				null
			);
			return;
		}

		// Insert Order to the db
		logger.Log("post", "Saving order to the db", LogLevel.INFO);
		await new OrderRepository().Save(parsedInOrder, userId, false, false, true, async result => {
			logger.Log("post", `Order saving result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "Order Inserted", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to insert Order",
					null
				);
				return;
			}
		});
	} catch (error) {
		logger.Log("post", `Error saving order: ${error}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to insert Order",
			null
		);
	}
});

router.put("/", async (req: OrderPostRequest, res: Response) => {
	const { order, userId } = req.body;

	try {
		let parsedInOrder = new Order(LogLevel.DEBUG, order);
		if (!order) {
			logger.Log("post", "Cannot find order from the body", LogLevel.ERROR);
			ResponseHandler.formatResponse(
				res,
				Number(ResponseCode.BAD_REQUEST_PARAMETERS),
				"Cannot find order from the body",
				null
			);
			return;
		}

		if (!userId) {
			logger.Log("post", "Cannot find userId from the body", LogLevel.ERROR);
			ResponseHandler.formatResponse(
				res,
				Number(ResponseCode.BAD_REQUEST_PARAMETERS),
				"Cannot find userId from the body",
				null
			);
			return;
		}

		// Update Order to the db
		logger.Log("post", "Updating order", LogLevel.INFO);
		await new OrderRepository().Save(parsedInOrder, userId, true, false, true, async result => {
			logger.Log("post", `Order saving result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "Order Inserted", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to insert Order",
					null
				);
				return;
			}
		});
	} catch (error) {
		logger.Log("post", `Error saving order: ${error}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to update Order",
			null
		);
	}
});

export default router;
