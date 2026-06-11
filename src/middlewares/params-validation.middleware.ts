import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateParams =
    (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return next(result.error);
        }

        req.params = result.data as any;

        next();
    };
