import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateQuery =
    <T extends ZodType>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return next(result.error);
        }

        res.locals.validatedQuery = result.data;

        next();
    };
