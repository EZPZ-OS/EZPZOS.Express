import prisma from "./PrismaService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Cuisine } from "../types/Cuisine";

export class MenuService {
	// Create a new cuisine
	async createCuisine(data: Cuisine): Promise<Cuisine> {
		try {
			const newCuisine = await prisma.cuisine.create({
				data: {
					Name: data.Name,
					Description: data.Description,
					Price: data.Price,
					Category: data.Category,
					IsAvailable: data.IsAvailable,
					EstimatedTime: data.EstimatedTime,
					CreatedTimestamp: new Date(),
					Image: data.Image,
					HotSales: data.HotSales
						? {
								create: data.HotSales.map(hotSale => ({
									HotSaleId: hotSale.HotSaleId,
									Discount: hotSale.Discount,
									Category: hotSale.Category,
									CreatedTimestamp: new Date(),
									UpdatedTimestamp: null
								}))
						  }
						: undefined
				}
			});
			// Transform null to undefined
			return newCuisine;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				console.error("Prisma error:", error.message);
				throw new Error(`Prisma error: ${error.message}`);
			} else {
				console.error("Failed to create cuisine.");
				throw new Error("Failed to create cuisine.");
			}
		}
	}

	// Get all cuisines
	async getAllCuisines(): Promise<Cuisine[]> {
		try {
			const cuisines = await prisma.cuisine.findMany({});
			return cuisines;
		} catch (error) {
			console.error("Failed to retrieve cuisines.");
			throw new Error("Failed to retrieve cuisines.");
		}
	}

	// Get a single cuisine by ID
	async getCuisineById(id: string): Promise<Cuisine> {
		try {
			const cuisine = await prisma.cuisine.findUnique({
				where: { Id: id }
			});

			if (!cuisine) {
				throw new Error("Cuisine not found");
			}

			return cuisine;
		} catch (error) {
			console.error("Failed to retrieve cuisine by ID.");
			throw new Error("Failed to retrieve cuisine by ID. ");
		}
	}

	// Update a cuisine by ID
	async updateCuisine(id: string, data: Partial<Cuisine>): Promise<Cuisine> {
		try {
			const updatedCuisine = await prisma.cuisine.update({
				where: { Id: id },
				data: {
					Name: data.Name,
					Description: data.Description,
					Price: data.Price,
					Category: data.Category,
					IsAvailable: data.IsAvailable,
					EstimatedTime: data.EstimatedTime,
					UpdatedTimestamp: new Date(),
					Image: data.Image
				}
			});

			return updatedCuisine;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				console.error("Prisma error:", error.message);
				throw new Error(`Prisma error: ${error.message}`);
			} else {
				console.error("Failed to update cuisine.");
				throw new Error("Failed to update cuisine.");
			}
		}
	}

	// Delete a cuisine by ID
	async deleteCuisine(id: string): Promise<Cuisine> {
		try {
			const deletedCuisine = await prisma.cuisine.delete({
				where: { Id: id }
			});

			return deletedCuisine;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				console.error("Prisma error:", error.message);
				throw new Error(`Prisma error: ${error.message}`);
			} else {
				console.error("Failed to delete cuisine.");
				throw new Error("Failed to delete cuisine.");
			}
		}
	}
}
