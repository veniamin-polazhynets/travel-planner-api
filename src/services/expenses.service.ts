import { ForbiddenError, NotFoundError } from "../errors/http.errors";
import { expensesRepository } from "../repositories/expenses.repository";
import { ExpenseResponse } from "../types/expense";
import { mapToExpenseResponse } from "../utils/mappers/expense-mapper";
import { CreateExpenseDto, UpdateExpenseDto } from "../validation/expenses";
import { tripsService } from "./trips.service";

export const expensesService = {
    async create(
        userId: number,
        tripId: number,
        dto: CreateExpenseDto,
    ): Promise<ExpenseResponse> {
        await tripsService.getTripAndCheckAccess(userId, tripId);
        const expenseData = { tripId, ...dto, amount: dto.amount.toFixed(2) };

        const expense = await expensesRepository.create(expenseData);

        return mapToExpenseResponse(expense);
    },

    async getAllByTripId(
        userId: number,
        tripId: number,
    ): Promise<ExpenseResponse[]> {
        await tripsService.getTripAndCheckAccess(userId, tripId);

        const result = await expensesRepository.findAllByTripId(tripId);

        return result.map(mapToExpenseResponse);
    },

    async getById(
        userId: number,
        tripId: number,
        expenseId: number,
    ): Promise<ExpenseResponse> {
        await tripsService.getTripAndCheckAccess(userId, tripId);

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
        await tripsService.getTripAndCheckAccess(userId, tripId);

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
        await tripsService.getTripAndCheckAccess(userId, tripId);

        const deletedExpense = await expensesRepository.delete(
            tripId,
            expenseId,
        );
        if (!deletedExpense) {
            throw new NotFoundError("Expense not found");
        }
    },
};
