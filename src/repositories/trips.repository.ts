import { desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { tripsTable } from "../db/schema";
import { CreateTripDao, Trip } from "../types/trip";

export const tripsRepository = {
    async createTrip(dao: CreateTripDao): Promise<Trip> {
        const [trip] = await db.insert(tripsTable).values(dao).returning();

        return trip;
    },

    async getAllByUserId(userId: number): Promise<Trip[]> {
        return await db
            .select()
            .from(tripsTable)
            .where(eq(tripsTable.userId, userId))
            .orderBy(desc(tripsTable.createdAt));
    },
};
