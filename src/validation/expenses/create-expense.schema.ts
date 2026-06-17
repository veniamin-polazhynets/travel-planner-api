import z from "zod";
import { baseExpenseSchema } from "./base-expense.schema";

export const createExpenseSchema = baseExpenseSchema;

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
