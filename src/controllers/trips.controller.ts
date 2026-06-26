import { Request, Response } from "express";
import { getAuthorizedUser } from "../utils/express/req.utils";
import { tripsService } from "../services/trips.service";
import {
    CreateTripDto,
    QueryTripsDto,
    UpdateTripDto,
} from "../validation/trips";

export const tripsController = {
    async create(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const body = res.locals.validatedBody as CreateTripDto;

        const result = await tripsService.create(user.id, body);

        res.status(201).json(result);
    },

    async getMany(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const query = res.locals.validatedQuery as QueryTripsDto;

        const result = await tripsService.getMany(user.id, query);

        res.status(200).json(result);
    },

    async getById(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const { tripId } = res.locals.validatedParams as { tripId: number };

        const result = await tripsService.getById(tripId, user.id);

        res.status(200).json(result);
    },

    async update(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const { tripId } = res.locals.validatedParams as { tripId: number };

        const body = res.locals.validatedBody as UpdateTripDto;

        const result = await tripsService.update(tripId, user.id, body);

        res.status(200).json(result);
    },

    async delete(req: Request, res: Response) {
        const user = getAuthorizedUser(req);

        const { tripId } = res.locals.validatedParams as { tripId: number };

        await tripsService.delete(tripId, user.id);

        res.sendStatus(204);
    },
};
