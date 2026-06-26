import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/body-validation.middleware";
import { updateUserSchema } from "../validation/users/update-user.schema";
import { deleteUserSchema } from "../validation/users/delete-user.schema";
import { usersController } from "../controllers/users.controller";

export const usersRouter = express.Router();

usersRouter.get("/me", authMiddleware, usersController.getProfile);

usersRouter.patch(
    "/me",
    authMiddleware,
    validateBody(updateUserSchema),
    usersController.updateProfile,
);

usersRouter.delete(
    "/me",
    authMiddleware,
    validateBody(deleteUserSchema),
    usersController.deleteAccount,
);
