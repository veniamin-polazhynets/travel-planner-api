import { z } from "zod";
import { baseTripSchema, validateDates } from "./base-trip.schema";

export const createTripSchema = baseTripSchema.refine(
    (data) => validateDates(data.startDate, data.endDate),
    {
        message: "End date must be greater than or equal to start date",
        path: ["endDate"],
    },
);

export type CreateTripDto = z.infer<typeof createTripSchema>;
