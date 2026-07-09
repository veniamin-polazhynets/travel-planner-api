import { z } from "zod";

export const tripParamsSchema = z.object({
    tripId: z.coerce.number().openapi({
        description: "Trip unique ID",
        example: 1,
    }),
});
