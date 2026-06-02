import { z } from "zod";

export const registrationSchema = z.object({
    username: z.string().trim().min(3).max(30),
    email: z.string().trim().email().toLowerCase().max(255),
    password: z.string().min(8).max(100),
});

export type RegistrationDto = z.infer<typeof registrationSchema>;
