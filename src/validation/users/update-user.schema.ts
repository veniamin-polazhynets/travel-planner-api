import { z } from "zod";
import { withNonEmptyBody } from "../common/with-non-empty-body";

const updateUserFields = z.object({
    username: z.string().trim().min(3).max(30).optional(),
    email: z.string().trim().email().toLowerCase().max(255).optional(),
});

export const updateUserSchema = withNonEmptyBody(updateUserFields);

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
