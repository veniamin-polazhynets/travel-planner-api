import { z } from "zod";

export const baseExpenseSchema = z.object({
    title: z.string().trim().min(3).max(100).openapi({
        description: "Expense title",
        example: "Dinner at Tonnarello San Pietro",
    }),
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
        .openapi({
            description: `Category of expense. Default is "other"`,
            example: "food",
        }),
    amount: z
        .number()
        .positive()
        .openapi({ description: "Expense amount in USD", example: 200.0 }),
});
