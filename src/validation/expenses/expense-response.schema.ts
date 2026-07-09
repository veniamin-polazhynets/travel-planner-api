import z from "zod";
import { baseExpenseSchema } from "./base-expense.schema";

export const expenseResponseSchema = z
    .object({
        id: z
            .number()
            .openapi({ description: "Expense unique ID", example: 1 }),
        tripId: z.number().openapi({
            description: "Trip ID to which the expense belongs",
            example: 1,
        }),
    })
    .merge(baseExpenseSchema);
