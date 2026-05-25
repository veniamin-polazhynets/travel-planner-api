import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 30 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 60 }).notNull(),
    tokenVersion: integer().default(0).notNull(),
});
