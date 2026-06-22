import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateParams } from "../middlewares/params-validation.middleware";

import { validateBody } from "../middlewares/body-validation.middleware";
import { createExpenseSchema } from "../validation/expenses/create-expense.schema";
import { expensesService } from "../services/expenses.service";
import { createIdParamSchema } from "../validation/common/id.schema";
import { updateExpenseSchema } from "../validation/expenses/update-expense.schema";

export const expensesRouter = express.Router({ mergeParams: true });

expensesRouter.post(
    "/",
    authMiddleware,
    validateBody(createExpenseSchema),
    validateParams(createIdParamSchema("tripId")),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const tripId = Number(req.params.tripId);
            const expense = await expensesService.create(
                userId,
                tripId,
                req.body,
            );

            res.status(201).json(expense);
        } catch (error) {
            next(error);
        }
    },
);

expensesRouter.get(
    "/",
    authMiddleware,
    validateParams(createIdParamSchema("tripId")),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const tripId = Number(req.params.tripId);
            const result = await expensesService.getAllByTripId(userId, tripId);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

expensesRouter.get(
    "/:expenseId",
    authMiddleware,
    validateParams(
        createIdParamSchema("tripId").merge(createIdParamSchema("expenseId")),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const tripId = Number(req.params.tripId);
            const expenseId = Number(req.params.expenseId);
            const expense = await expensesService.getById(
                userId,
                tripId,
                expenseId,
            );

            res.status(200).json(expense);
        } catch (error) {
            next(error);
        }
    },
);

expensesRouter.patch(
    "/:expenseId",
    authMiddleware,
    validateParams(
        createIdParamSchema("tripId").merge(createIdParamSchema("expenseId")),
    ),
    validateBody(updateExpenseSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const tripId = Number(req.params.tripId);
            const expenseId = Number(req.params.expenseId);
            const result = await expensesService.update(
                userId,
                tripId,
                expenseId,
                req.body,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

expensesRouter.delete(
    "/:expenseId",
    authMiddleware,
    validateParams(
        createIdParamSchema("tripId").merge(createIdParamSchema("expenseId")),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const tripId = Number(req.params.tripId);
            const expenseId = Number(req.params.expenseId);
            const result = await expensesService.delete(
                userId,
                tripId,
                expenseId,
            );

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },
);
