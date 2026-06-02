import { z } from "zod";

export const updateUserSchema = z.object({
    username: z.string().trim().min(3).max(30).optional(),
    email: z.string().trim().email().toLowerCase().max(255).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
