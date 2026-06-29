import { Request, Response } from "express";
import { expensesService } from "../services/expenses.service";
import { getAuthorizedUser } from "../utils/express/req.utils";
import { CreateExpenseDto, UpdateExpenseDto } from "../validation/expenses";

export const expensesController = {
    async create(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const { tripId } = res.locals.validatedParams as { tripId: number };
        const body = res.locals.validatedBody as CreateExpenseDto;

        const result = await expensesService.create(user.id, tripId, body);

        res.status(201).json(result);
    },

    async getAllByTripId(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const { tripId } = res.locals.validatedParams as { tripId: number };

        const result = await expensesService.getAllByTripId(user.id, tripId);

        res.status(200).json(result);
    },

    async getById(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const { tripId, expenseId } = res.locals.validatedParams as {
            tripId: number;
            expenseId: number;
        };

        const result = await expensesService.getById(
            user.id,
            tripId,
            expenseId,
        );

        res.status(200).json(result);
    },

    async update(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const { tripId, expenseId } = res.locals.validatedParams as {
            tripId: number;
            expenseId: number;
        };
        const body = res.locals.validatedBody as UpdateExpenseDto;

        const result = await expensesService.update(
            user.id,
            tripId,
            expenseId,
            body,
        );

        res.status(200).json(result);
    },

    async delete(req: Request, res: Response) {
        const user = getAuthorizedUser(req);
        const { tripId, expenseId } = res.locals.validatedParams as {
            tripId: number;
            expenseId: number;
        };

        await expensesService.delete(user.id, tripId, expenseId);

        res.sendStatus(204);
    },
};
