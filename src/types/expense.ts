export type ExpenseCategory =
    | "accommodation"
    | "transport"
    | "food"
    | "entertainment"
    | "shopping"
    | "services"
    | "other";

export type Expense = {
    id: number;
    tripId: number;
    title: string;
    category: ExpenseCategory;
    amount: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateExpenseDao = {
    tripId: number;
    title: string;
    category: ExpenseCategory;
    amount: string;
};

export type UpdateExpenseDao = Partial<Omit<CreateExpenseDao, "tripId">>;

export type ExpenseResponse = Omit<Expense, "createdAt" | "updatedAt">;
