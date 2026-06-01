import { z } from "zod";

export const registrationSchema = z.object({
    username: z.string().min(3).max(30).trim(),
    email: z.string().trim().email().toLowerCase().max(255),
    password: z.string().min(8).max(100),
});

export type RegistrationDto = z.infer<typeof registrationSchema>;
