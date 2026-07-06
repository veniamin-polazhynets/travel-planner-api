import { NextFunction, Request, Response } from "express";
import rateLimit, { Options } from "express-rate-limit";
import { TooManyRequestsError } from "../errors/http.errors";

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    handler: (
        req: Request,
        res: Response,
        next: NextFunction,
        options: Options,
    ) => {
        next(
            new TooManyRequestsError(
                "Too many attempts. Please try again later",
            ),
        );
    },

    standardHeaders: "draft-7",
    legacyHeaders: false,
});
