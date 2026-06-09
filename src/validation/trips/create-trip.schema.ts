import { z } from "zod";
import { baseTripSchema } from "./base-trip.schema";

export const createTripSchema = baseTripSchema.refine(
    (data) => {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
    },
    {
        message: "End date must be greater than or equal to start date",
        path: ["endDate"],
    },
);

export type CreateTripDto = z.infer<typeof createTripSchema>;
