import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { expensesTable } from "../db/schema";
import { CreateExpenseDao, Expense } from "../types/expense";

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
};
