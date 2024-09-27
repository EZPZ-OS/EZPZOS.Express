import { Cuisine } from "@prisma/client";

export interface Image {
    Id: string;
    Name: string;
    Path: string;
    Content: Buffer; 
    CuisineId: string;
    CreatedTimestamp: Date;
    UpdatedTimestamp: Date | null;
    Cuisine: Cuisine; 
  }