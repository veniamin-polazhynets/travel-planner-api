import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().default(8000),
    DATABASE_URL: z.string({ error: "DATABASE_URL is missing" }),
    ACCESS_TOKEN_SECRET: z.string({
        error: "ACCESS_TOKEN_SECRET is missing",
    }),
    REFRESH_TOKEN_SECRET: z.string({
        error: "REFRESH_TOKEN_SECRET is missing",
    }),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
    console.error(
        "Invalid environment configuration:",
        z.prettifyError(envParse.error),
    );
    throw new Error("Fix your .env file before running the server");
}

export const {
    NODE_ENV,
    PORT,
    DATABASE_URL,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
} = envParse.data;
