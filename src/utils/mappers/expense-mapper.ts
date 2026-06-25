import { Expense, ExpenseResponse } from "../../types/expense";

export const mapToExpenseResponse = (expense: Expense): ExpenseResponse => {
    return {
        id: expense.id,
        tripId: expense.tripId,
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
    };
};
