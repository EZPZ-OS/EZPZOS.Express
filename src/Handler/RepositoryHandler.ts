import { OrderItemRepository, OrderRepository } from "ezpzos.core";
import { OrderRepository as OrderRepositoryClass } from "ezpzos.core/lib/Repository/OrderRepository";
import { OrderItemRepository as OrderItemRepositoryClass } from "ezpzos.core/lib/Repository/OrderItemRepository";

export class RepsoitoryHandler {
	public static async OrderRepository(): Promise<typeof OrderRepositoryClass> {
		let repo = (await OrderRepository())?.OrderRepository;
		if (repo) return repo;
		else {
			throw new Error("Order Repository not found");
		}
	}
	public static async OrderItemRepository(): Promise<typeof OrderItemRepositoryClass> {
		let repo = (await OrderItemRepository())?.OrderItemRepository;
		if (repo) return repo;
		else {
			throw new Error("OrderItem Repository not found");
		}
	}
}
