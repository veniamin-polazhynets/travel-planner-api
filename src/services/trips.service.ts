import { ForbiddenError, NotFoundError } from "../errors/http.errors";
import { tripsRepository } from "../repositories/trips.repository";
import { TripArrayResponse, TripResponse, UpdateTripDao } from "../types/trip";
import { mapToTripResponse } from "../utils/mappers/trip-mapper";
import { CreateTripDto } from "../validation/trips/create-trip.schema";
import { QueryTripsDto } from "../validation/trips/query-trips.schema";
import { UpdateTripDto } from "../validation/trips/update-trip.schema";

export const tripsService = {
    async create(userId: number, dto: CreateTripDto): Promise<TripResponse> {
        const tripData = { userId, ...dto, budget: dto.budget.toFixed(2) };

        const trip = await tripsRepository.create(tripData);

        return mapToTripResponse(trip);
    },

    async getMany(
        userId: number,
        dto: QueryTripsDto,
    ): Promise<TripArrayResponse> {
        const { data, totalTrips } = await tripsRepository.findManyByUserId(
            userId,
            dto,
        );

        const totalPages = Math.ceil(totalTrips / dto.limit);

        const mappedTrips = data.map(mapToTripResponse);

        return {
            data: mappedTrips,
            meta: {
                totalItems: totalTrips,
                totalPages,
                currentPage: dto.page,
                pageSize: dto.limit,
            },
        };
    },

    async getById(tripId: number, userId: number): Promise<TripResponse> {
        const trip = await tripsRepository.findById(tripId);

        if (!trip) {
            throw new NotFoundError("Trip not found");
        }

        if (trip.userId !== userId) {
            throw new ForbiddenError("Access denied for this trip");
        }

        return mapToTripResponse(trip);
    },

    async update(
        tripId: number,
        userId: number,
        dto: UpdateTripDto,
    ): Promise<TripResponse> {
        const trip = await tripsRepository.findById(tripId);

        if (!trip) {
            throw new NotFoundError("Trip not found");
        }

        if (trip.userId !== userId) {
            throw new ForbiddenError("Access denied for this trip");
        }

        const { budget, ...restDto } = dto;

        const tripData = {
            ...restDto,
            ...(budget !== undefined ? { budget: budget.toFixed(2) } : {}),
        };

        const updatedTrip = await tripsRepository.update(tripId, tripData);

        if (!updatedTrip) {
            throw new NotFoundError("Trip not found during update");
        }

        return mapToTripResponse(updatedTrip);
    },

    async delete(tripId: number, userId: number): Promise<void> {
        const deletedTrip = await tripsRepository.delete(tripId, userId);

        if (!deletedTrip) {
            throw new NotFoundError("Trip not found");
        }
    },
};
