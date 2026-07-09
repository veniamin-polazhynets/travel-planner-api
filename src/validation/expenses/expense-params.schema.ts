import z from "zod";

export const expenseParamsSchema = z.object({
    tripId: z.coerce.number().openapi({
        description: "Trip ID to which the expense belongs",
        example: 1,
    }),
    expenseId: z.coerce.number().openapi({
        description: "Expense unique ID",
        example: 1,
    }),
});
