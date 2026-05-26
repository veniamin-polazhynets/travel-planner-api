import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const validateBody =
    (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(result.error);
        }

        req.body = result.data;

        next();
    };
