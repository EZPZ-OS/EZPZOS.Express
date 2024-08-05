import express, { Request, Response, Router } from "express";
import { LogHandler, LogLevel, Order, OrderItem, OrderRepository, ResponseCode } from "ezpzos.core";
import { ResponseHandler } from "../Handler/ResponseHandler";
import OrderItemRouter from "./OrderItem";
import { RepsoitoryHandler } from "../Handler/RepositoryHandler";

const router: Router = express.Router();

const logger = new LogHandler("Order.ts");

interface OrderRequest extends Request {
	body: {
		order: Order;
	};
}

router.post("/userId/:userId", async (req: OrderRequest, res: Response) => {
	const { order } = req.body;
	const { userId } = req.params;

	try {
		let parsedInOrder = new Order(LogLevel.ALL, order);
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

		let repo = new (await RepsoitoryHandler.OrderRepository())();

		await repo.Save(parsedInOrder, userId, false, false, true, async result => {
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

router.put("/:orderId/userId/:userId", async (req: OrderRequest, res: Response) => {
	const { order } = req.body;
	const { orderId, userId } = req.params;

	try {
		let repo = new (await RepsoitoryHandler.OrderRepository())();

		await repo.GetById(orderId, "Order", async orderItem => {
			if (!orderItem) {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to find Order",
					null
				);
				return;
			} else {
				logger.Log("GetById", "Found order for updating", LogLevel.TRACE);
			}
		});

		let parsedInOrder = new Order(LogLevel.ALL, order);
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

		if (!orderId) {
			logger.Log("post", "Cannot find orderId from the Parameter", LogLevel.ERROR);
			ResponseHandler.formatResponse(
				res,
				Number(ResponseCode.BAD_REQUEST_PARAMETERS),
				"Cannot find orderId from the Parameter",
				null
			);
			return;
		}

		// Update Order to the db
		logger.Log("post", "Updating order", LogLevel.INFO);
		await repo.Save(parsedInOrder, userId, true, false, true, async result => {
			logger.Log("post", `Order Updating result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "Order Updated", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to Update Order",
					null
				);
				return;
			}
		});
	} catch (err) {
		logger.Log("post", `Error saving order: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to update Order",
			null
		);
	}
});

router.delete("/:orderId/userId/:userId", async (req: OrderRequest, res: Response) => {
	const { orderId, userId } = req.params;

	try {
		let order = new Order();
		order.Id = orderId;

		let repo = new (await RepsoitoryHandler.OrderRepository())();
		await repo.Save(order, userId, true, false, true, async result => {
			logger.Log("post", `Order Deleting result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "Order Deleted", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to Delete Order",
					null
				);
				return;
			}
		});
	} catch (err) {
		logger.Log("delete", `Error deleting order: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to delete Order",
			null
		);
	}
});

router.get("/:orderId", async (req: OrderRequest, res: Response) => {
	const { orderId } = req.params;

	try {
		let repo = new (await RepsoitoryHandler.OrderRepository())();
		await repo.GetOrderById(orderId, true, async dataobject => {
			if (dataobject) {
				let order = new Order(LogLevel.ALL, dataobject);
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "Order Found", order);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to get Order",
					null
				);
				return;
			}
		});
	} catch (err) {
		logger.Log("get", `Error getting order: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(res, Number(ResponseCode.SERVICE_REQUEST_FAILURE), "Failed to get Order", null);
	}
});

router.use("/orderItem", OrderItemRouter);

export default router;
