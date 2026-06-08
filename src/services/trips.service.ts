import { NotFoundError } from "../errors/http.errors";
import { tripsRepository } from "../repositories/trips.repository";
import { TripResponse } from "../types/trip";
import { CreateTripDto } from "../validation/trips/create-trip.schema";

export const tripsService = {
    async create(userId: number, dto: CreateTripDto): Promise<TripResponse> {
        const tripData = { userId, ...dto, budget: dto.budget.toFixed(2) };

        const trip = await tripsRepository.create(tripData);

        return {
            id: trip.id,
            title: trip.title,
            country: trip.country,
            city: trip.city,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
        };
    },

    async getAll(userId: number): Promise<TripResponse[]> {
        const trips = await tripsRepository.findAllByUserId(userId);

        return trips.map((trip) => ({
            id: trip.id,
            title: trip.title,
            country: trip.country,
            city: trip.city,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
        }));
    },

    async getById(tripId: number, userId: number): Promise<TripResponse> {
        const trip = await tripsRepository.findByIdAndUserId(tripId, userId);

        if (!trip) {
            throw new NotFoundError("Trip not found");
        }

        return {
            id: trip.id,
            title: trip.title,
            country: trip.country,
            city: trip.city,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
        };
    },
};
