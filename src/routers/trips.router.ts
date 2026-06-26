import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/body-validation.middleware";
import { createTripSchema } from "../validation/trips/create-trip.schema";
import { updateTripSchema } from "../validation/trips/update-trip.schema";
import { validateQuery } from "../middlewares/query-validation.middleware";
import { queryTripsSchema } from "../validation/trips/query-trips.schema";
import { validateParams } from "../middlewares/params-validation.middleware";
import { expensesRouter } from "./expenses.router";
import { createIdParamSchema } from "../validation/common/id.schema";
import { tripsController } from "../controllers/trips.controller";

export const tripsRouter = express.Router();

tripsRouter.post(
    "/",
    authMiddleware,
    validateBody(createTripSchema),
    tripsController.create,
);

tripsRouter.get(
    "/",
    authMiddleware,
    validateQuery(queryTripsSchema),
    tripsController.getMany,
);

tripsRouter.get(
    "/:tripId",
    authMiddleware,
    validateParams(createIdParamSchema("tripId")),
    tripsController.getById,
);

tripsRouter.patch(
    "/:tripId",
    authMiddleware,
    validateParams(createIdParamSchema("tripId")),
    validateBody(updateTripSchema),
    tripsController.update,
);

tripsRouter.delete(
    "/:tripId",
    authMiddleware,
    validateParams(createIdParamSchema("tripId")),
    tripsController.delete,
);

tripsRouter.use("/:tripId/expenses", expensesRouter);
