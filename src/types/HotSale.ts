import { CuisineHotSale } from "@prisma/client";

export interface HotSale {
    Id: string;
    SaleTimestamp: Date;
    ExpiryTimestamp: Date;
    ReductionRequired: number;
    Reduction: number;
    Cuisines?: CuisineHotSale[]; // Relation to many CuisineHotSale
    CreatedTimestamp: Date;
    UpdatedTimestamp: Date | null;
  }