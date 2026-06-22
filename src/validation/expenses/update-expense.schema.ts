import z from "zod";
import { baseExpenseSchema } from "./base-expense.schema";

export const updateExpenseSchema = baseExpenseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Body must contain at least one field to update",
    });

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
