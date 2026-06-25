import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { expensesTable } from "../db/schema";
import { CreateExpenseDao, Expense, UpdateExpenseDao } from "../types/expense";

const defaultExpenseFields = {
    id: expensesTable.id,
    tripId: expensesTable.tripId,
    title: expensesTable.title,
    category: expensesTable.category,
    amount: expensesTable.amount,
    createdAt: expensesTable.createdAt,
    updatedAt: expensesTable.updatedAt,
};

export const expensesRepository = {
    async create(dao: CreateExpenseDao): Promise<Expense> {
        const [expense] = await db
            .insert(expensesTable)
            .values(dao)
            .returning(defaultExpenseFields);

        return expense;
    },

    async findAllByTripId(tripId: number): Promise<Expense[]> {
        const expenses = await db
            .select(defaultExpenseFields)
            .from(expensesTable)
            .where(eq(expensesTable.tripId, tripId));

        return expenses;
    },

    async findById(
        tripId: number,
        expenseId: number,
    ): Promise<Expense | undefined> {
        const [expense] = await db
            .select(defaultExpenseFields)
            .from(expensesTable)
            .where(
                and(
                    eq(expensesTable.id, expenseId),
                    eq(expensesTable.tripId, tripId),
                ),
            );

        return expense;
    },

    async update(
        tripId: number,
        expenseId: number,
        dao: UpdateExpenseDao,
    ): Promise<Expense | undefined> {
        const [expense] = await db
            .update(expensesTable)
            .set({ ...dao, updatedAt: new Date() })
            .where(
                and(
                    eq(expensesTable.id, expenseId),
                    eq(expensesTable.tripId, tripId),
                ),
            )
            .returning(defaultExpenseFields);

        return expense;
    },

    async delete(
        tripId: number,
        expenseId: number,
    ): Promise<Expense | undefined> {
        const [deletedExpense] = await db
            .delete(expensesTable)
            .where(
                and(
                    eq(expensesTable.id, expenseId),
                    eq(expensesTable.tripId, tripId),
                ),
            )
            .returning(defaultExpenseFields);

        return deletedExpense;
    },
};
