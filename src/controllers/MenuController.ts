import { Request, Response } from "express";
import { Cuisine } from "../types/Cuisine";
import { LogHandler, LogLevel } from "ezpzos.core";
import { MenuService } from "../services/MenuService";

const logger = new LogHandler("MenuController.ts");
const menuService = new MenuService();

export const CreateCuisine = async (req: Request, res: Response) => {
	try {
		const data: Cuisine = req.body;
		// Ensure the base64 string exists before processing
		// if (data.Image && typeof data.Image === 'string') {
		// 	// Convert base64 to a Buffer (binary data)
		// 	const binaryData = Buffer.from(data.Image, 'base64');

		// 	// Replace or assign binary data to Image field (depending on your schema)
		// 	data.Image = binaryData;
		// }

		const newCuisine = await menuService.createCuisine(data);
		res.status(201).json({ newCuisine, message: "Cuisine successfully created" });
	} catch (error) {
		logger.Log("CreateCuisine", "Error creating cuisine", LogLevel.WARN);
		res.status(500).json({ message: "Failed to create cuisine" });
	}
};

export const GetAllCuisines = async (req: Request, res: Response) => {
	try {
		const cuisines = await menuService.getAllCuisines();
		res.status(200).json(cuisines);
	} catch (error) {
		logger.Log("GetAllCuisines", "Error retrieving cuisines", LogLevel.WARN);
		res.status(500).json({ message: "Failed to retrieve cuisines" });
	}
};

export const GetCuisineById = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const cuisine = await menuService.getCuisineById(id);

		if (!cuisine) {
			logger.Log("GetCuisineById", `Cuisine with ID ${id} not found`, LogLevel.INFO);
			return res.status(404).json({ message: "Cuisine not found" });
		}

		res.status(200).json(cuisine);
	} catch (error) {
		logger.Log("GetCuisineById", "Error retrieving cuisine by ID", LogLevel.WARN);
		res.status(500).json({ message: "Failed to retrieve cuisine by ID" });
	}
};

export const UpdateCuisine = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const data: Partial<Cuisine> = req.body;
		const updatedCuisine = await menuService.updateCuisine(id, data);

		res.status(200).json({ updatedCuisine, message: "Cuisine successfully updated" });
	} catch (error) {
		logger.Log("UpdateCuisine", "Error updating cuisine with ID", LogLevel.WARN);
		res.status(500).json({ message: "Failed to update cuisine" });
	}
};

export const DeleteCuisine = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const deletedCuisine = await menuService.deleteCuisine(id);

		res.status(200).json({ deletedCuisine, message: "Cuisine successfully deleted" });
	} catch (error) {
		logger.Log("DeleteCuisine", "Error deleting cuisine with ID", LogLevel.WARN);
		res.status(500).json({ message: "Failed to delete cuisine" });
	}
};
