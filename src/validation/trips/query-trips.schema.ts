import z from "zod";

export const queryTripsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(2).max(20).default(10),
    search: z.string().trim().min(1).max(100).optional(),
    country: z.string().trim().min(1).max(100).optional(),
    city: z.string().trim().min(1).max(100).optional(),
});

export type QueryTripsDto = z.infer<typeof queryTripsSchema>;
