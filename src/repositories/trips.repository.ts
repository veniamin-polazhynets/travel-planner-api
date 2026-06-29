import { and, asc, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { db } from "../db/db";
import { tripsTable } from "../db/schema";
import {
    CreateTripDao,
    QueryTripsDao,
    Trip,
    UpdateTripDao,
} from "../types/trip";

const defaultTripFields = {
    id: tripsTable.id,
    userId: tripsTable.userId,
    title: tripsTable.title,
    country: tripsTable.country,
    city: tripsTable.city,
    startDate: tripsTable.startDate,
    endDate: tripsTable.endDate,
    budget: tripsTable.budget,
    createdAt: tripsTable.createdAt,
    updatedAt: tripsTable.updatedAt,
};

export const tripsRepository = {
    async create(dao: CreateTripDao): Promise<Trip> {
        const [trip] = await db
            .insert(tripsTable)
            .values(dao)
            .returning(defaultTripFields);
        return trip;
    },

    async findManyByUserId(
        id: number,
        dao: QueryTripsDao,
    ): Promise<{ data: Trip[]; totalTrips: number }> {
        const { page, limit, search, country, city, sortBy, order, from, to } =
            dao;
        const offset = (page - 1) * limit;

        const whereConditions = [eq(tripsTable.userId, id)];
        if (search)
            whereConditions.push(ilike(tripsTable.title, `%${search}%`));
        if (country) whereConditions.push(eq(tripsTable.country, country));
        if (city) whereConditions.push(eq(tripsTable.city, city));
        if (from) whereConditions.push(gte(tripsTable.startDate, from));
        if (to) whereConditions.push(lte(tripsTable.startDate, to));

        const orderByColumns = {
            startDate: tripsTable.startDate,
            endDate: tripsTable.endDate,
            budget: tripsTable.budget,
            createdAt: tripsTable.createdAt,
        };
        const orderByRow = orderByColumns[sortBy];
        const sortFunction = order === "asc" ? asc : desc;
        const orderByClause = sortFunction(orderByRow);

        const dataPromise = db
            .select(defaultTripFields)
            .from(tripsTable)
            .where(and(...whereConditions))
            .orderBy(orderByClause)
            .limit(limit)
            .offset(offset);

        const countPromise = db
            .select({ totalTrips: count() })
            .from(tripsTable)
            .where(and(...whereConditions));

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
            .select(defaultTripFields)
            .from(tripsTable)
            .where(eq(tripsTable.id, id));
        return trip;
    },

    async update(id: number, dao: UpdateTripDao): Promise<Trip | undefined> {
        const [trip] = await db
            .update(tripsTable)
            .set({ ...dao, updatedAt: new Date() })
            .where(eq(tripsTable.id, id))
            .returning(defaultTripFields);
        return trip;
    },

    async delete(userId: number, tripId: number): Promise<Trip | undefined> {
        const [deletedTrip] = await db
            .delete(tripsTable)
            .where(
                and(eq(tripsTable.id, tripId), eq(tripsTable.userId, userId)),
            )
            .returning(defaultTripFields);
        return deletedTrip;
    },
};
