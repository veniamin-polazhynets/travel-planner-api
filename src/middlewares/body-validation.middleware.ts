import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateBody =
    <T extends ZodType>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(result.error);
        }

        res.locals.validatedBody = result.data;

        next();
    };
