import { z } from "zod";

export const deleteUserSchema = z.object({
    password: z
        .string()
        .min(8)
        .max(100)
        .openapi({
            description: "Current password to confirm account deletion",
            example: "1234567890",
        }),
});

export type DeleteUserDto = z.infer<typeof deleteUserSchema>;
