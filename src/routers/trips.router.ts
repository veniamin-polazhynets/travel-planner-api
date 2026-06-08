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
            const trip = await tripsService.createTrip(req.user!.id, req.body);

            res.status(201).json(trip);
        } catch (error) {
            next(error);
        }
    },
);
