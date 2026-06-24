import { Trip, TripResponse } from "../../types/trip";

export const mapToTripResponse = (trip: Trip): TripResponse => {
    return {
        id: trip.id,
        title: trip.title,
        country: trip.country,
        city: trip.city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
    };
};
