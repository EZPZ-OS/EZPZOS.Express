import { CuisineHotSale } from "@prisma/client";

export interface Cuisine {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    Category: string;
    IsAvailable: boolean;
    EstimatedTime: number;
    Image: Buffer; 
    HotSales?: CuisineHotSale[]; // Relation to many HotSales
    CreatedTimestamp: Date;
    UpdatedTimestamp: Date | null;
  }