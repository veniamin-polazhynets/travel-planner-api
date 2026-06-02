import { eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { usersTable } from "../db/schema";
import { CreateUserDao, UpdateUserDao, User } from "../types/user";

export const usersRepository = {
    async createUser(dao: CreateUserDao): Promise<User> {
        const [user] = await db.insert(usersTable).values(dao).returning();

        return user;
    },

    async findById(userId: number): Promise<User | undefined> {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        return user || undefined;
    },

    async findByUsername(username: string): Promise<User | undefined> {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username));

        return user || undefined;
    },

    async findByEmail(email: string): Promise<User | undefined> {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        return user || undefined;
    },

    async incrementTokenVersion(userId: number): Promise<void> {
        await db
            .update(usersTable)
            .set({
                tokenVersion: sql`${usersTable.tokenVersion} + 1`,
            })
            .where(eq(usersTable.id, userId));
    },

    async updateUser(userId: number, dao: UpdateUserDao): Promise<User> {
        const [user] = await db
            .update(usersTable)
            .set(dao)
            .where(eq(usersTable.id, userId))
            .returning();

        return user;
    },

    async deleteUser(userId: number): Promise<void> {
        await db.delete(usersTable).where(eq(usersTable.id, userId));
    },
};
