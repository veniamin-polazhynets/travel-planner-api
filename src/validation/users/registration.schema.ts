import { z } from "zod";

export const registrationSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3)
        .max(30)
        .openapi({ description: "Unique username", example: "User123" }),
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

export type RegistrationDto = z.infer<typeof registrationSchema>;
