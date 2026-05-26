import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../config/config";
import { AppError } from "../errors/app.error";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const isDev = NODE_ENV === "development";

    if (isDev) {
        console.error(error);
    }

    if (error instanceof AppError && error.isOperational) {
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            isOperational: true,
            error: error.message,
            ...(isDev && { stack: error.stack }),
        });
    }

    return res.status(500).json({
        statusCode: 500,
        isOperational: false,
        error: "Internal server error",
        ...(isDev && { stack: error.stack }),
    });
};
