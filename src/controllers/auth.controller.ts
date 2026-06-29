import { Request, Response } from "express";
import { NODE_ENV } from "../config/config";
import { UnauthorizedError } from "../errors/http.errors";
import { authService } from "../services/auth.service";
import { getAuthorizedUser } from "../utils/express/req.utils";
import { LoginDto, RegistrationDto } from "../validation/users";

export const authController = {
    async register(req: Request, res: Response) {
        const body = res.locals.validatedBody as RegistrationDto;

        const result = await authService.register(body);

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
    },

    async login(req: Request, res: Response) {
        const body = res.locals.validatedBody as LoginDto;

        const result = await authService.login(body);

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
    },

    async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedError("Refresh token not provided");
        }

        const result = await authService.refresh(refreshToken);

        res.status(200).json(result);
    },

    async logout(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const result = await authService.logout(user.id);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: NODE_ENV === "production",
        });
        res.status(200).json({
            logoutMessage: result.logoutMessage,
        });
    },
};
