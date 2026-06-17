import { z } from "zod";

export const baseExpenseSchema = z.object({
    title: z.string().trim().min(3).max(100),
    category: z
        .enum([
            "accommodation",
            "transport",
            "food",
            "entertainment",
            "shopping",
            "services",
            "other",
        ])
        .default("other"),
    amount: z.number().positive(),
});
