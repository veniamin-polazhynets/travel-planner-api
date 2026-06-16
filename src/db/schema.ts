import { pgEnum } from "drizzle-orm/pg-core";
import {
    date,
    integer,
    numeric,
    pgTable,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    username: varchar("username", { length: 30 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 60 }).notNull(),
    tokenVersion: integer("token_version").default(0).notNull(),
});

export const tripsTable = pgTable("trips", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    budget: numeric("budget", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const expenseCategoryEnum = pgEnum("category", [
    "accommodation",
    "transport",
    "food",
    "entertainment",
    "shopping",
    "services",
    "other",
]);

export const expensesTable = pgTable("expenses", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    tripId: integer("trip_id")
        .references(() => tripsTable.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    category: expenseCategoryEnum().notNull().default("other"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
