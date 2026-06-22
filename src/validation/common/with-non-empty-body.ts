import z from "zod";

export const withNonEmptyBody = <T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
) => {
    return schema.refine((data) => Object.keys(data).length > 0, {
        message: "Body must contain at least one field to update",
    });
};
