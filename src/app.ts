import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.handler";
import { authRouter } from "./routers/auth.router";
import { usersRouter } from "./routers/users.router";
import { tripsRouter } from "./routers/trips.router";

export const app = express();

app.use(cors({ credentials: true }));

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/trips", tripsRouter);

app.use(errorHandler);
