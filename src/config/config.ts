export const PORT: number = Number(process.env.PORT) || 8000;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

export const DATABASE_URL = process.env.DATABASE_URL;
