import z from "zod";
import { baseTripSchema } from "./base-trip.schema";

export const tripResponseSchema = z
    .object({
        id: z.number().openapi({ description: "Trip unique ID", example: 1 }),
    })
    .merge(baseTripSchema)
    .extend({
        budget: z.string().openapi({
            description: "Trip budget in USD",
            example: "1500.00",
        }),
    });
