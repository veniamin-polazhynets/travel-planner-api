import z from "zod";

export const createIdParamSchema = (paramName: string) => {
    return z.object({
        [paramName]: z.coerce.number().int().positive(),
    });
};
