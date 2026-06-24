import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/http.errors";
import { jwtHelper } from "../utils/jwt";
import { usersRepository } from "../repositories/users.repository";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(
                new UnauthorizedError("Authorization header not provided"),
            );
        }

        const [type, accessToken] = authHeader.split(" ");

        if (type !== "Bearer") {
            return next(new UnauthorizedError("Invalid authorization type"));
        }

        if (!accessToken) {
            return next(new UnauthorizedError("Access token not provided"));
        }

        let payload;

        try {
            payload = jwtHelper.verifyAccessToken(accessToken);
        } catch {
            return next(new UnauthorizedError("Invalid or expired token"));
        }

        const user = await usersRepository.findById(payload.id);

        if (!user) {
            return next(new UnauthorizedError("User no longer exists"));
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return next(new UnauthorizedError("Token has been invalidated"));
        }

        req.user = { id: user.id, tokenVersion: user.tokenVersion };

        next();
    } catch (error) {
        next(error);
    }
};
