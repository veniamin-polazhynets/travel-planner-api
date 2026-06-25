import { ForbiddenError, NotFoundError } from "../errors/http.errors";
import { expensesRepository } from "../repositories/expenses.repository";
import { tripsRepository } from "../repositories/trips.repository";
import { ExpenseResponse } from "../types/expense";
import { mapToExpenseResponse } from "../utils/mappers/expense-mapper";
import { CreateExpenseDto } from "../validation/expenses/create-expense.schema";
import { UpdateExpenseDto } from "../validation/expenses/update-expense.schema";

const checkTripAccess = async (userId: number, tripId: number) => {
    const trip = await tripsRepository.findById(tripId);

    if (!trip) {
        throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== userId) {
        throw new ForbiddenError("Access denied for this trip");
    }
};

export const expensesService = {
    async create(
        userId: number,
        tripId: number,
        dto: CreateExpenseDto,
    ): Promise<ExpenseResponse> {
        await checkTripAccess(userId, tripId);

        const expenseData = { tripId, ...dto, amount: dto.amount.toFixed(2) };

        const expense = await expensesRepository.create(expenseData);

        return mapToExpenseResponse(expense);
    },

    async getAllByTripId(
        userId: number,
        tripId: number,
    ): Promise<ExpenseResponse[]> {
        await checkTripAccess(userId, tripId);

        const result = await expensesRepository.findAllByTripId(tripId);

        return result.map(mapToExpenseResponse);
    },

    async getById(
        userId: number,
        tripId: number,
        expenseId: number,
    ): Promise<ExpenseResponse> {
        await checkTripAccess(userId, tripId);

        const expense = await expensesRepository.findById(tripId, expenseId);

        if (!expense) {
            throw new NotFoundError("Expense not found");
        }

        if (expense.tripId !== tripId) {
            throw new ForbiddenError("Access denied for this trip");
        }

        return mapToExpenseResponse(expense);
    },

    async update(
        userId: number,
        tripId: number,
        expenseId: number,
        dto: UpdateExpenseDto,
    ): Promise<ExpenseResponse> {
        await checkTripAccess(userId, tripId);

        const expense = await expensesRepository.findById(tripId, expenseId);

        if (!expense) {
            throw new NotFoundError("Expense not found");
        }

        const { amount, ...restDto } = dto;

        const expenseData = {
            ...restDto,
            ...(amount !== undefined ? { amount: amount.toFixed(2) } : {}),
        };

        const updatedExpense = await expensesRepository.update(
            tripId,
            expenseId,
            expenseData,
        );

        if (!updatedExpense) {
            throw new NotFoundError("Expense not found during update");
        }

        return mapToExpenseResponse(updatedExpense);
    },

    async delete(
        userId: number,
        tripId: number,
        expenseId: number,
    ): Promise<void> {
        await checkTripAccess(userId, tripId);

        const deletedExpense = await expensesRepository.delete(
            tripId,
            expenseId,
        );

        if (!deletedExpense) {
            throw new NotFoundError("Expense not found");
        }
    },
};
