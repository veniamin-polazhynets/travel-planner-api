import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
        .toLowerCase()
        .max(255)
        .openapi({ description: "User email", example: "user123@gmail.com" }),
    password: z
        .string()
        .min(8)
        .max(100)
        .openapi({ description: "Secure password", example: "1234567890" }),
});

export type LoginDto = z.infer<typeof loginSchema>;
