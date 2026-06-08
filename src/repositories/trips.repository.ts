import { db } from "../db/db";
import { tripsTable } from "../db/schema";
import { CreateTripDao, Trip } from "../types/trip";

export const tripsRepository = {
    async createTrip(dao: CreateTripDao): Promise<Trip> {
        const [trip] = await db.insert(tripsTable).values(dao).returning();

        return trip;
    },
};
