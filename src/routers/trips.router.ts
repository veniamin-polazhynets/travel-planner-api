import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/body-validation.middleware";
import { createTripSchema } from "../validation/trips/create-trip.schema";
import { tripsService } from "../services/trips.service";

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
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await tripsService.getAll(req.user!.id);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

tripsRouter.get(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await tripsService.getById(
                +req.params.id,
                req.user!.id,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);
