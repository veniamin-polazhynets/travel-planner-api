import { ForbiddenError, NotFoundError } from "../errors/http.errors";
import { expensesRepository } from "../repositories/expenses.repository";
import { tripsRepository } from "../repositories/trips.repository";
import { ExpenseResponse } from "../types/expense";
import { CreateExpenseDto } from "../validation/expenses/create-expense.schema";

export const expensesService = {
    async create(
        userId: number,
        tripId: number,
        dto: CreateExpenseDto,
    ): Promise<ExpenseResponse> {
        const trip = await tripsRepository.findById(tripId);

        if (!trip) {
            throw new NotFoundError("Trip not found");
        }

        if (trip.userId !== userId) {
            throw new ForbiddenError(
                "You don't have access to this trip expenses",
            );
        }

        const expenseData = { tripId, ...dto, amount: dto.amount.toFixed(2) };

        const expense = await expensesRepository.create(expenseData);

        return {
            id: expense.id,
            tripId: expense.tripId,
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
        };
    },

    async getAllByTripId(
        userId: number,
        tripId: number,
    ): Promise<ExpenseResponse[]> {
        const trip = await tripsRepository.findById(tripId);

        if (!trip) {
            throw new NotFoundError("Trip not found");
        }

        if (trip.userId !== userId) {
            throw new ForbiddenError(
                "You don't have access to this trip expenses",
            );
        }

        const result = await expensesRepository.findAllByTripId(tripId);

        return result.map((expense) => ({
            id: expense.id,
            tripId: expense.tripId,
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
        }));
    },

    async getById(
        userId: number,
        tripId: number,
        expenseId: number,
    ): Promise<ExpenseResponse> {
        const trip = await tripsRepository.findById(tripId);

        if (!trip) {
            throw new NotFoundError("Trip not found");
        }

        if (trip.userId !== userId) {
            throw new ForbiddenError(
                "You don't have access to this trip expense",
            );
        }

        const expense = await expensesRepository.findById(expenseId);

        if (!expense) {
            throw new NotFoundError("Expense not found");
        }

        if (expense.tripId !== tripId) {
            throw new ForbiddenError(
                "You don't have access to this trip expense",
            );
        }

        return {
            id: expense.id,
            tripId: expense.tripId,
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
        };
    },
};
