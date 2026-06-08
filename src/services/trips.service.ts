import { tripsRepository } from "../repositories/trips.repository";
import { TripResponse } from "../types/trip";
import { CreateTripDto } from "../validation/trips/create-trip.schema";

export const tripsService = {
    async createTrip(
        userId: number,
        dto: CreateTripDto,
    ): Promise<TripResponse> {
        const tripData = { userId, ...dto, budget: dto.budget.toFixed(2) };

        const trip = await tripsRepository.createTrip(tripData);

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

    async getUserTrips(userId: number): Promise<TripResponse[]> {
        const trips = await tripsRepository.getAllByUserId(userId);

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
};
