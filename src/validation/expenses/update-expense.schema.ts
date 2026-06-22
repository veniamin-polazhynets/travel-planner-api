import z from "zod";
import { baseExpenseSchema } from "./base-expense.schema";
import { withNonEmptyBody } from "../common/with-non-empty-body";

export const updateExpenseSchema = withNonEmptyBody(
    baseExpenseSchema.partial(),
);

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
