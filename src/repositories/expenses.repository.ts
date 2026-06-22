import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { expensesTable } from "../db/schema";
import { CreateExpenseDao, Expense, UpdateExpenseDao } from "../types/expense";

export const expensesRepository = {
    async create(dao: CreateExpenseDao): Promise<Expense> {
        const [expense] = await db
            .insert(expensesTable)
            .values(dao)
            .returning();

        return expense;
    },

    async findAllByTripId(tripId: number): Promise<Expense[]> {
        const expenses = await db
            .select()
            .from(expensesTable)
            .where(eq(expensesTable.tripId, tripId));

        return expenses;
    },

    async findById(id: number): Promise<Expense | undefined> {
        const [expense] = await db
            .select()
            .from(expensesTable)
            .where(eq(expensesTable.id, id));

        return expense || undefined;
    },

    async update(
        id: number,
        dao: UpdateExpenseDao,
    ): Promise<Expense | undefined> {
        const [expense] = await db
            .update(expensesTable)
            .set({ ...dao, updatedAt: new Date() })
            .where(eq(expensesTable.id, id))
            .returning();

        return expense || undefined;
    },

    async delete(
        expenseId: number,
        tripId: number,
    ): Promise<Expense | undefined> {
        const [deletedExpense] = await db
            .delete(expensesTable)
            .where(
                and(
                    eq(expensesTable.id, expenseId),
                    eq(expensesTable.tripId, tripId),
                ),
            )
            .returning();

        return deletedExpense || undefined;
    },
};
