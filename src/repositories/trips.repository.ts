import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { tripsTable } from "../db/schema";
import { CreateTripDao, Trip } from "../types/trip";

export const tripsRepository = {
    async create(dao: CreateTripDao): Promise<Trip> {
        const [trip] = await db.insert(tripsTable).values(dao).returning();

        return trip;
    },

    async findAllByUserId(id: number): Promise<Trip[]> {
        return await db
            .select()
            .from(tripsTable)
            .where(eq(tripsTable.userId, id))
            .orderBy(desc(tripsTable.createdAt));
    },

    async findByIdAndUserId(
        tripId: number,
        userId: number,
    ): Promise<Trip | undefined> {
        const [trip] = await db
            .select()
            .from(tripsTable)
            .where(
                and(eq(tripsTable.id, tripId), eq(tripsTable.userId, userId)),
            );

        return trip || undefined;
    },
};
