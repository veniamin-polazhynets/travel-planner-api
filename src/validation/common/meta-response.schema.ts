import { z } from "zod";

export const metaResponseSchema = z.object({
    totalItems: z.number().openapi({
        description: "Total number of items in the database",
        example: 45,
    }),
    totalPages: z
        .number()
        .openapi({ description: "Total number of pages", example: 5 }),
    currentPage: z
        .number()
        .openapi({ description: "Current page number", example: 1 }),
    pageSize: z
        .number()
        .openapi({ description: "Number of items per page", example: 10 }),
});
