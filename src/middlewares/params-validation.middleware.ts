import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateParams =
    <T extends ZodType>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return next(result.error);
        }

        req.params = result.data as any;

        next();
    };
