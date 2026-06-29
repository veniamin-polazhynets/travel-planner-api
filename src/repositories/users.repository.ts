import { eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { usersTable } from "../db/schema";
import { CreateUserDao, UpdateUserDao, User } from "../types/user";

const defaultUserFields = {
    id: usersTable.id,
    username: usersTable.username,
    email: usersTable.email,
    passwordHash: usersTable.passwordHash,
    tokenVersion: usersTable.tokenVersion,
    createdAt: usersTable.createdAt,
    updatedAt: usersTable.updatedAt,
};

export const usersRepository = {
    async create(dao: CreateUserDao): Promise<User> {
        const [user] = await db
            .insert(usersTable)
            .values(dao)
            .returning(defaultUserFields);
        return user;
    },

    async findById(id: number): Promise<User | undefined> {
        const [user] = await db
            .select(defaultUserFields)
            .from(usersTable)
            .where(eq(usersTable.id, id));
        return user;
    },

    async findByUsername(username: string): Promise<User | undefined> {
        const [user] = await db
            .select(defaultUserFields)
            .from(usersTable)
            .where(eq(usersTable.username, username));
        return user;
    },

    async findByEmail(email: string): Promise<User | undefined> {
        const [user] = await db
            .select(defaultUserFields)
            .from(usersTable)
            .where(eq(usersTable.email, email));
        return user;
    },

    async incrementTokenVersion(id: number): Promise<void> {
        await db
            .update(usersTable)
            .set({
                tokenVersion: sql`${usersTable.tokenVersion} + 1`,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.id, id));
    },

    async update(id: number, dao: UpdateUserDao): Promise<User | undefined> {
        const [user] = await db
            .update(usersTable)
            .set({ ...dao, updatedAt: new Date() })
            .where(eq(usersTable.id, id))
            .returning(defaultUserFields);
        return user;
    },

    async delete(id: number): Promise<User | undefined> {
        const [deletedUser] = await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning(defaultUserFields);
        return deletedUser;
    },
};
