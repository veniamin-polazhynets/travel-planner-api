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
};
