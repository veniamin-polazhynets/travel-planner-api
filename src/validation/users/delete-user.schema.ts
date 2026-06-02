import { z } from "zod";

export const deleteUserSchema = z.object({
    password: z.string().min(8).max(100),
});

export type DeleteUserDto = z.infer<typeof deleteUserSchema>;
