import z from "zod";

export const tripIdSchema = z.object({
    id: z.coerce.number().int().min(1),
});

export type TripIdDto = z.infer<typeof tripIdSchema>;
