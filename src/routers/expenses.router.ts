import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateParams } from "../middlewares/params-validation.middleware";

import { validateBody } from "../middlewares/body-validation.middleware";
import { createExpenseSchema } from "../validation/expenses/create-expense.schema";
import { expensesService } from "../services/expenses.service";
import { createIdParamSchema } from "../validation/common/id.schema";

export const expensesRouter = express.Router({ mergeParams: true });

expensesRouter.post(
    "/",
    authMiddleware,
    validateBody(createExpenseSchema),
    validateParams(createIdParamSchema("tripId")),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tripId = Number(req.params.tripId);
            const userId = req.user!.id;
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
