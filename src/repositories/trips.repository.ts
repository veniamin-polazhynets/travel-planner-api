import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { tripsTable } from "../db/schema";
import { CreateTripDao, Trip, UpdateTripDao } from "../types/trip";

export const tripsRepository = {
    async create(dao: CreateTripDao): Promise<Trip> {
        const [trip] = await db.insert(tripsTable).values(dao).returning();

        return trip;
    },

    async findManyByUserId(
        id: number,
        page: number,
        limit: number,
    ): Promise<{ data: Trip[]; totalTrips: number }> {
        const offset = (page - 1) * limit;

        const dataPromise = db
            .select()
            .from(tripsTable)
            .where(eq(tripsTable.userId, id))
            .orderBy(desc(tripsTable.createdAt))
            .limit(limit)
            .offset(offset);

        const countPromise = db
            .select({ totalTrips: count() })
            .from(tripsTable)
            .where(eq(tripsTable.userId, id));

        const [data, countResult] = await Promise.all([
            dataPromise,
            countPromise,
        ]);

        const totalTrips = countResult[0].totalTrips ?? 0;

        return {
            data,
            totalTrips,
        };
    },

    async findById(id: number): Promise<Trip | undefined> {
        const [trip] = await db
            .select()
            .from(tripsTable)
            .where(eq(tripsTable.id, id));

        return trip || undefined;
    },

    async update(id: number, dao: UpdateTripDao): Promise<Trip | undefined> {
        const [trip] = await db
            .update(tripsTable)
            .set(dao)
            .where(eq(tripsTable.id, id))
            .returning();

        return trip || undefined;
    },

    async delete(tripId: number, userId: number): Promise<Trip | undefined> {
        const [deletedTrip] = await db
            .delete(tripsTable)
            .where(
                and(eq(tripsTable.id, tripId), eq(tripsTable.userId, userId)),
            )
            .returning();

        return deletedTrip || undefined;
    },
};
