import { z } from "zod";
import { baseTripSchema, validateDates } from "./base-trip.schema";
import { withNonEmptyBody } from "../common/with-non-empty-body";

export const updateTripSchema = withNonEmptyBody(
    baseTripSchema
        .partial()
        .refine((data) => validateDates(data.startDate, data.endDate), {
            message: "End date must be greater than or equal to start date",
            path: ["endDate"],
        }),
);

export type UpdateTripDto = z.infer<typeof updateTripSchema>;
