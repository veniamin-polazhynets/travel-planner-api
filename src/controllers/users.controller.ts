import { Request, Response } from "express";
import { NODE_ENV } from "../config/config";
import { usersService } from "../services/users.service";
import { getAuthorizedUser } from "../utils/express/req.utils";
import { DeleteUserDto, UpdateUserDto } from "../validation/users";

export const usersController = {
    async getProfile(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const result = await usersService.getProfile(user.id);

        res.status(200).json(result);
    },

    async updateProfile(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const body = res.locals.validatedBody as UpdateUserDto;

        const result = await usersService.updateProfile(user.id, body);

        res.status(200).json(result);
    },

    async deleteAccount(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const body = res.locals.validatedBody as DeleteUserDto;

        await usersService.deleteAccount(user.id, body);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: NODE_ENV === "production",
        });
        res.sendStatus(204);
    },
};
