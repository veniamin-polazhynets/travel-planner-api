import { z } from "zod";
import { baseTripSchema } from "./base-trip.schema";

export const updateTripSchema = baseTripSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Body must contain at least one field to update",
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                const start = new Date(data.startDate);
                const end = new Date(data.endDate);
                return end >= start;
            }
            return true;
        },
        {
            message: "End date must be greater than or equal to start date",
            path: ["endDate"],
        },
    );

export type UpdateTripDto = z.infer<typeof updateTripSchema>;
