export type CreateExpenseDao = {
    tripId: number;
    title: string;
    category:
        | "accommodation"
        | "transport"
        | "food"
        | "entertainment"
        | "shopping"
        | "services"
        | "other";
    amount: string;
};

export type Expense = {
    id: number;
    tripId: number;
    title: string;
    category:
        | "accommodation"
        | "transport"
        | "food"
        | "entertainment"
        | "shopping"
        | "services"
        | "other";
    amount: string;
    createdAt: Date;
    updatedAt: Date;
};
