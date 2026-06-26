import express from "express";
import { validateBody } from "../middlewares/body-validation.middleware";
import { registrationSchema } from "../validation/users/registration.schema";
import { loginSchema } from "../validation/users/login.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authController } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(registrationSchema),
    authController.register,
);

authRouter.post("/login", validateBody(loginSchema), authController.login);

authRouter.post("/refresh", authController.refresh);

authRouter.post("/logout", authMiddleware, authController.logout);
