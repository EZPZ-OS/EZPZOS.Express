import express, { Request, Response, Router } from "express";
import { LogHandler, LogLevel, OrderItem, OrderItemRepository, ResponseCode } from "ezpzos.core";
import { ResponseHandler } from "../Handler/ResponseHandler";

const router: Router = express.Router();

const logger = new LogHandler("Order.ts");

interface OrderItemRequest extends Request {
	body: {
		orderItem: OrderItem;
	};
}

router.get("/orderId/:orderId", async (req: OrderItemRequest, res: Response) => {
	const { orderId } = req.params;

	try {
		await new OrderItemRepository().GetOrderItemsByOrderId(orderId, true, async orderItems => {
			if (orderItems) {
				let responseOrderItems = [];
				for (let orderItem of orderItems) {
					responseOrderItems.push(new OrderItem(LogLevel.ALL, orderItem));
				}
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SUCCEED_CREATED),
					"OrderItems Found",
					responseOrderItems
				);
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
		logger.Log("get", `Error getting OrderItems: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to get OrderItems",
			null
		);
	}
});

router.post("/userId/:userId", async (req: OrderItemRequest, res: Response) => {
	const { orderItem } = req.body;
	const { userId } = req.params;

	try {
		let parseOrderItem = new OrderItem(LogLevel.ALL, orderItem);
		await new OrderItemRepository().Save(parseOrderItem, userId, false, false, true, async result => {
			logger.Log("post", `OrderItem saving result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "OrderItem Created", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to create OrderItem",
					null
				);
				return;
			}
		});
	} catch (err) {
		logger.Log("post", `Error creating OrderItem: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to create OrderItem",
			null
		);
	}
});

router.put("/:orderItemId/userId/:userId", async (req: OrderItemRequest, res: Response) => {
	const { orderItemId, userId } = req.params;
	const { orderItem } = req.body;

	try {
		let repo = new OrderItemRepository();
		await repo.GetById(orderItemId, "OrderItem", async orderItem => {
			if (!orderItem) {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to find OrderItem",
					null
				);
				return;
			} else {
				logger.Log("GetById", "Found orderItem for updating", LogLevel.TRACE);
			}
		});
		let parseOrderItem = new OrderItem(LogLevel.ALL, orderItem);
		await repo.Save(parseOrderItem, userId, true, false, true, async result => {
			logger.Log("put", `OrderItem updating result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "OrderItem updated", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to update OrderItem",
					null
				);
				return;
			}
		});
	} catch (err) {
		logger.Log("put", `Error updating OrderItem: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to update OrderItem",
			null
		);
	}
});

router.delete("/:orderItemId/userId/:userId", async (req: OrderItemRequest, res: Response) => {
	const { orderItemId, userId } = req.params;

	try {
		let orderItem = new OrderItem();
		orderItem.Id = orderItemId;
		await new OrderItemRepository().Save(orderItem, userId, false, true, true, async result => {
			logger.Log("post", `OrderItem deleting result:${result}`, LogLevel.INFO);

			if (result) {
				ResponseHandler.formatResponse(res, Number(ResponseCode.SUCCEED_CREATED), "OrderItem Deleted", null);
				return;
			} else {
				ResponseHandler.formatResponse(
					res,
					Number(ResponseCode.SERVICE_REQUEST_FAILURE),
					"Failed to Delete OrderItem",
					null
				);
				return;
			}
		});
	} catch (err) {
		logger.Log("delete", `Error deleting OrderItem: ${err}`, LogLevel.ERROR);
		ResponseHandler.formatResponse(
			res,
			Number(ResponseCode.SERVICE_REQUEST_FAILURE),
			"Failed to delete OrderItem",
			null
		);
	}
});
export default router;
