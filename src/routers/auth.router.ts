import express, { NextFunction, Request, Response } from "express";
import { validateBody } from "../middlewares/body-validation.middleware";
import { registrationSchema } from "../validation/users/registration.schema";
import { authService } from "../services/auth.service";
import { NODE_ENV } from "../config/config";
import { loginSchema } from "../validation/users/login.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UnauthorizedError } from "../errors/http.errors";

export const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(registrationSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.register(req.body);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        } catch (error) {
            next(error);
        }
    },
);

authRouter.post(
    "/login",
    validateBody(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.login(req.body);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        } catch (error) {
            next(error);
        }
    },
);

authRouter.post(
    "/refresh",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                throw new UnauthorizedError("Refresh token not provided");
            }

            const result = await authService.refresh(refreshToken);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.post(
    "/logout",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.logout(req.user!.id);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: NODE_ENV === "production",
            });

            res.status(200).json({
                logoutMessage: result.logoutMessage,
            });
        } catch (error) {
            next(error);
        }
    },
);
