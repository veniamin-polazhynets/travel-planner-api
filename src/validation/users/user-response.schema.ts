import { z } from "zod";

export const userResponseSchema = z.object({
    id: z.number().openapi({ description: "User unique ID", example: 1 }),
    username: z
        .string()
        .openapi({ description: "Unique username", example: "User123" }),
    email: z
        .string()
        .email()
        .openapi({ description: "User email", example: "user123@example.com" }),
});
