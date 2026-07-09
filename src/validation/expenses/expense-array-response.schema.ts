import z from "zod";
import { expenseResponseSchema } from "./expense-response.schema";

export const expenseArrayResponseSchema = z.array(expenseResponseSchema);
