import { Cuisine, HotSale } from '@prisma/client';

export interface CuisineHotSale {
    Id: string;
    Category: string;
    Discount: number;
    CuisineId: string;
    HotSaleId: string;
    CreatedTimestamp: Date;
    UpdatedTimestamp: Date | null;
    Cuisine: Cuisine; // Relation to Cuisine
    HotSale: HotSale; // Relation to HotSale
  }