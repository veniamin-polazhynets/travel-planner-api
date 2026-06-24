import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { usersService } from "../services/users.service";
import { validateBody } from "../middlewares/body-validation.middleware";
import { updateUserSchema } from "../validation/users/update-user.schema";
import { deleteUserSchema } from "../validation/users/delete-user.schema";
import { NODE_ENV } from "../config/config";
import { getAuthorizedUser } from "../utils/express/req.utils";

export const usersRouter = express.Router();

usersRouter.get(
    "/me",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthorizedUser(req);
            const result = await usersService.getProfile(user.id);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

usersRouter.patch(
    "/me",
    authMiddleware,
    validateBody(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthorizedUser(req);
            const result = await usersService.updateProfile(user.id, req.body);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

usersRouter.delete(
    "/me",
    authMiddleware,
    validateBody(deleteUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthorizedUser(req);
            await usersService.deleteAccount(user.id, req.body);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: NODE_ENV === "production",
            });

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },
);
