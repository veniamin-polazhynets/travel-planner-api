import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateParams } from "../middlewares/params-validation.middleware";
import { validateBody } from "../middlewares/body-validation.middleware";
import { createExpenseSchema } from "../validation/expenses/create-expense.schema";
import { createIdParamSchema } from "../validation/common/id.schema";
import { updateExpenseSchema } from "../validation/expenses/update-expense.schema";
import { expensesController } from "../controllers/expenses.controller";

export const expensesRouter = express.Router({ mergeParams: true });

expensesRouter.post(
    "/",
    authMiddleware,
    validateBody(createExpenseSchema),
    validateParams(createIdParamSchema("tripId")),
    expensesController.create,
);

expensesRouter.get(
    "/",
    authMiddleware,
    validateParams(createIdParamSchema("tripId")),
    expensesController.getAllByTripId,
);

expensesRouter.get(
    "/:expenseId",
    authMiddleware,
    validateParams(
        createIdParamSchema("tripId").merge(createIdParamSchema("expenseId")),
    ),
    expensesController.getById,
);

expensesRouter.patch(
    "/:expenseId",
    authMiddleware,
    validateParams(
        createIdParamSchema("tripId").merge(createIdParamSchema("expenseId")),
    ),
    validateBody(updateExpenseSchema),
    expensesController.update,
);

expensesRouter.delete(
    "/:expenseId",
    authMiddleware,
    validateParams(
        createIdParamSchema("tripId").merge(createIdParamSchema("expenseId")),
    ),
    expensesController.delete,
);
