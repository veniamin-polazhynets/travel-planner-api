import { z } from "zod";

export const createTripSchema = z
    .object({
        title: z.string().trim().min(3).max(100),
        country: z.string().trim().min(3).max(100),
        city: z.string().trim().min(3).max(100),
        startDate: z.string().trim().date(),
        endDate: z.string().trim().date(),
        budget: z.number().positive(),
    })
    .refine(
        (data) => {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return end >= start;
        },
        {
            message: "End date must be greater than or equal to start date",
            path: ["endDate"],
        },
    );

export type CreateTripDto = z.infer<typeof createTripSchema>;
