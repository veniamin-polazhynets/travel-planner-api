import { sql } from "drizzle-orm";
import request from "supertest";
import { app } from "../app";
import { db } from "../db/db";
import {
    createManyTrips,
    createTrip,
    createUser,
    expectTripsListData,
    expectTripsListMeta,
    generateTripData,
    testUnauthorizedCases,
} from "./helpers";

describe("Trips", () => {
    describe("POST /trips", () => {
        it("should create trip and return 201", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .post("/trips")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Trip to Italy",
                    country: "Italy",
                    city: "Rome",
                    startDate: "2026-06-01",
                    endDate: "2026-06-30",
                    budget: 1000,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe("Trip to Italy");
            expect(response.body).toHaveProperty("country");
            expect(response.body.country).toBe("Italy");
            expect(response.body).toHaveProperty("city");
            expect(response.body.city).toBe("Rome");
            expect(response.body).toHaveProperty("startDate");
            expect(response.body.startDate).toBe("2026-06-01");
            expect(response.body).toHaveProperty("endDate");
            expect(response.body.endDate).toBe("2026-06-30");
            expect(response.body).toHaveProperty("budget");
            expect(response.body.budget).toBe("1000.00");
        });

        it("should return 400 when body is invalid", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .post("/trips")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: 1,
                    country: "a",
                    city: "b",
                    startDate: 2026,
                    endDate: "30/06/2026",
                    budget: "",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 400 when end date is before start date", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .post("/trips")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Summer Trip to Italy",
                    country: "Italy",
                    city: "Rome",
                    startDate: "2026-06-30",
                    endDate: "2026-06-01",
                    budget: 1500,
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
            expect(response.body.details[0].message).toBe(
                "End date must be greater than or equal to start date",
            );
        });

        testUnauthorizedCases("post", "/trips");
    });

    describe("GET /trips", () => {
        it("should return empty data array, meta, and 200 when there is no trips", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .get("/trips")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response);
            expectTripsListMeta(response);
        });

        it("should return trips array and 200", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData(undefined, 1));

            const response = await request(app)
                .get("/trips")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 1);
            expectTripsListMeta(response, 1, 1, 1, 10);
        });

        it("should apply default pagination", async () => {
            const { accessToken } = await createUser();
            await createManyTrips(accessToken, 12);

            const response = await request(app)
                .get("/trips")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 10);
            expectTripsListMeta(response, 12, 2, 1, 10);
        });

        it("should return second page of trips", async () => {
            const { accessToken } = await createUser();
            await createManyTrips(accessToken, 12);

            const response = await request(app)
                .get("/trips?page=2")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 2);
            expectTripsListMeta(response, 12, 2, 2, 10);
        });

        it("should change number of trips on page", async () => {
            const { accessToken } = await createUser();
            await createManyTrips(accessToken, 12);

            const response = await request(app)
                .get("/trips?limit=2")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 2);
            expectTripsListMeta(response, 12, 6, 1, 2);
        });

        it("should find trips based on search by title", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData());
            await createTrip(
                accessToken,
                generateTripData({ title: "My summer trip" }),
            );

            const response = await request(app)
                .get("/trips?search=summer")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 1);
            expectTripsListMeta(response, 1, 1, 1, 10);
            expect(response.body.data[0].title).toBe("My summer trip");
        });

        it("should find trips based on country filter", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData());
            await createTrip(
                accessToken,
                generateTripData({ country: "France", city: "Paris" }),
            );

            const response = await request(app)
                .get("/trips?country=France")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 1);
            expectTripsListMeta(response, 1, 1, 1, 10);
            expect(response.body.data[0].country).toBe("France");
        });

        it("should find trips based on city filter", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData());
            await createTrip(
                accessToken,
                generateTripData({ country: "France", city: "Paris" }),
            );

            const response = await request(app)
                .get("/trips?city=Paris")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 1);
            expectTripsListMeta(response, 1, 1, 1, 10);
            expect(response.body.data[0].city).toBe("Paris");
        });

        it("should sort trips by budget in ascending order", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData({ budget: 3000 }));
            await createTrip(accessToken, generateTripData({ budget: 1000 }));
            await createTrip(accessToken, generateTripData({ budget: 2000 }));

            const response = await request(app)
                .get("/trips?sortBy=budget&order=asc")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 3);
            expectTripsListMeta(response, 3, 1, 1, 10);
            expect(response.body.data[0].budget).toBe("1000.00");
            expect(response.body.data[1].budget).toBe("2000.00");
            expect(response.body.data[2].budget).toBe("3000.00");
        });

        it("should return trips within the specified range", async () => {
            const { accessToken } = await createUser();
            await createManyTrips(accessToken, 5);
            await createTrip(
                accessToken,
                generateTripData({
                    startDate: "2026-07-01",
                    endDate: "2026-07-30",
                }),
            );
            await createTrip(
                accessToken,
                generateTripData({
                    startDate: "2026-08-01",
                    endDate: "2026-08-07",
                }),
            );
            await createTrip(
                accessToken,
                generateTripData({
                    startDate: "2026-08-08",
                    endDate: "2026-08-30",
                }),
            );

            const response = await request(app)
                .get("/trips?from=2026-07-01&to=2026-08-05")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expectTripsListData(response, 2);
            expectTripsListMeta(response, 2, 1, 1, 10);
            expect(response.body.data[0].startDate).toBe("2026-08-01");
            expect(response.body.data[0].endDate).toBe("2026-08-07");
            expect(response.body.data[1].startDate).toBe("2026-07-01");
            expect(response.body.data[1].endDate).toBe("2026-07-30");
        });

        it(`should return 400 when parameter "from" is greater than or equal to parameter "to"`, async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .get("/trips?from=2026-08-01&to=2026-07-01")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
            expect(response.body.details[0].message).toBe(
                `Parameter "to" must be greater than or equal to parameter "from"`,
            );
        });

        testUnauthorizedCases("get", "/trips");
    });

    describe("GET /trips/:id", () => {
        it("should return trip and 200", async () => {
            const { accessToken } = await createUser();
            const tripData = generateTripData();
            const trip = await createTrip(accessToken, tripData);

            const response = await request(app)
                .get(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe(tripData.title);
            expect(response.body).toHaveProperty("country");
            expect(response.body.country).toBe(tripData.country);
            expect(response.body).toHaveProperty("city");
            expect(response.body.city).toBe(tripData.city);
            expect(response.body).toHaveProperty("startDate");
            expect(response.body.startDate).toBe(tripData.startDate);
            expect(response.body).toHaveProperty("endDate");
            expect(response.body.endDate).toBe(tripData.endDate);
            expect(response.body).toHaveProperty("budget");
            expect(response.body.budget).toBe(tripData.budget.toFixed(2));
        });

        it("should return 400 when tripId is out of valid integer range", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .get("/trips/9999999999")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 403 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const { accessToken } = await createUser();

            const response = await request(app)
                .get(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when trip not found", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .get("/trips/100")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Trip not found");
        });

        testUnauthorizedCases("get", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            return `/trips/${trip.id}`;
        });
    });

    describe("PATCH /trips/:id", () => {
        it("should update trip and return 200", async () => {
            const { accessToken } = await createUser();
            const tripData = generateTripData();
            const trip = await createTrip(accessToken, tripData);

            const response = await request(app)
                .patch(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ city: "Venice" });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe(tripData.title);
            expect(response.body).toHaveProperty("country");
            expect(response.body.country).toBe(tripData.country);
            expect(response.body).toHaveProperty("city");
            expect(response.body.city).toBe("Venice");
            expect(response.body).toHaveProperty("startDate");
            expect(response.body.startDate).toBe(tripData.startDate);
            expect(response.body).toHaveProperty("endDate");
            expect(response.body.endDate).toBe(tripData.endDate);
            expect(response.body).toHaveProperty("budget");
            expect(response.body.budget).toBe(tripData.budget.toFixed(2));
        });

        it("should return 400 when body is empty", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .patch(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
            expect(response.body.details[0].message).toBe(
                "Body must contain at least one field to update",
            );
        });

        it("should return 403 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const { accessToken } = await createUser();

            const response = await request(app)
                .patch(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ city: "Venice" });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when trip not found", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .patch("/trips/100")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ city: "Venice" });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Trip not found");
        });

        testUnauthorizedCases("patch", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            return `/trips/${trip.id}`;
        });
    });

    describe("DELETE /trips/:id", () => {
        it("should delete trip and return 204", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .delete(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(204);
        });

        it("should return 404 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const { accessToken } = await createUser();

            const response = await request(app)
                .delete(`/trips/${trip.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Trip not found");
        });

        it("should return 404 when trip not found", async () => {
            const { accessToken } = await createUser();
            await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .delete("/trips/100")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Trip not found");
        });

        testUnauthorizedCases("delete", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            return `/trips/${trip.id}`;
        });
    });
});

afterEach(async () => {
    await db.execute(
        sql`TRUNCATE TABLE users, trips, expenses RESTART IDENTITY CASCADE`,
    );
});

afterAll(async () => {
    await db.$client.end();
});
