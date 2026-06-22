import z from "zod";
import { baseExpenseSchema } from "./base-expense.schema";

export const createExpenseSchema = baseExpenseSchema.extend({
    category: baseExpenseSchema.shape.category.default("other"),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
