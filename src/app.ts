import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { CLIENT_URL } from "./config/config";
import { errorHandler } from "./middlewares/error.handler";
import { authRouter } from "./routers/auth.router";
import { tripsRouter } from "./routers/trips.router";
import { usersRouter } from "./routers/users.router";
import { setupSwagger } from "./config/swagger";

export const app = express();
app.use(helmet());

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json());

app.use(cookieParser());

setupSwagger(app);

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/trips", tripsRouter);

app.use(errorHandler);
