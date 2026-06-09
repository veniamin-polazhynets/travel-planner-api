import { z } from "zod";

export const baseTripSchema = z.object({
    title: z.string().trim().min(3).max(100),
    country: z.string().trim().min(3).max(100),
    city: z.string().trim().min(3).max(100),
    startDate: z.string().trim().date(),
    endDate: z.string().trim().date(),
    budget: z.number().positive(),
});
