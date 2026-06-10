import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateQuery =
    (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return next(result.error);
        }

        res.locals.queryData = result.data;

        next();
    };
