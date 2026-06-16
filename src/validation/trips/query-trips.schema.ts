import z from "zod";
import { baseQueryTripsSchema } from "./base-query-trips.schema";

export const queryTripsSchema = baseQueryTripsSchema.refine(
    (data) => {
        if (data.from && data.to) {
            const fromDate = new Date(data.from);
            const toDate = new Date(data.to);
            return toDate >= fromDate;
        }

        return true;
    },
    {
        message: `Parameter "to" must be greater than or equal to parameter "from"`,
        path: ["to"],
    },
);

export type QueryTripsDto = z.infer<typeof queryTripsSchema>;
