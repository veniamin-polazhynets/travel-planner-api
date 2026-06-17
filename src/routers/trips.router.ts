import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/body-validation.middleware";
import { createTripSchema } from "../validation/trips/create-trip.schema";
import { tripsService } from "../services/trips.service";
import { updateTripSchema } from "../validation/trips/update-trip.schema";
import { validateQuery } from "../middlewares/query-validation.middleware";
import {
    QueryTripsDto,
    queryTripsSchema,
} from "../validation/trips/query-trips.schema";
import { validateParams } from "../middlewares/params-validation.middleware";
import { TripIdDto, tripIdSchema } from "../validation/trips/trip-id.schema";
import { expensesRouter } from "./expenses.router";

export const tripsRouter = express.Router();

tripsRouter.post(
    "/",
    authMiddleware,
    validateBody(createTripSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trip = await tripsService.create(req.user!.id, req.body);

            res.status(201).json(trip);
        } catch (error) {
            next(error);
        }
    },
);

tripsRouter.get(
    "/",
    authMiddleware,
    validateQuery(queryTripsSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryData = res.locals.queryData as QueryTripsDto;

            const result = await tripsService.getMany(req.user!.id, queryData);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

tripsRouter.get(
    "/:id",
    authMiddleware,
    validateParams(tripIdSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params = req.params as unknown as TripIdDto;

            const result = await tripsService.getById(params.id, req.user!.id);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

tripsRouter.patch(
    "/:id",
    authMiddleware,
    validateParams(tripIdSchema),
    validateBody(updateTripSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params = req.params as unknown as TripIdDto;

            const result = await tripsService.update(
                params.id,
                req.user!.id,
                req.body,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

tripsRouter.delete(
    "/:id",
    authMiddleware,
    validateParams(tripIdSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params = req.params as unknown as TripIdDto;

            await tripsService.delete(params.id, req.user!.id);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },
);

tripsRouter.use("/:tripId/expenses", expensesRouter);
