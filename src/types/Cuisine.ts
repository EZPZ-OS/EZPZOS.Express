import { Image, CuisineHotSale } from "@prisma/client";

export interface Cuisine {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    Category: string;
    IsAvailable: boolean;
    EstimatedTime: number;
    Images?: Image[]; // Relation to many Images
    HotSales?: CuisineHotSale[]; // Relation to many HotSales
    CreatedTimestamp: Date;
    UpdatedTimestamp: Date | null;
  }