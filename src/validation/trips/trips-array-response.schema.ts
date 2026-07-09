import z from "zod";
import { tripResponseSchema } from "./trip-response.schema";
import { metaResponseSchema } from "../common";

export const tripsArrayResponseSchema = z.object({
    data: z
        .array(tripResponseSchema)
        .openapi({ description: "Array of trips" }),
    meta: metaResponseSchema,
});
