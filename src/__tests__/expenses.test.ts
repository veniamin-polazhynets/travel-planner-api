import { sql } from "drizzle-orm";
import request from "supertest";
import { app } from "../app";
import { db } from "../db/db";
import {
    createExpense,
    createTrip,
    createUser,
    generateExpenseData,
    generateTripData,
    testUnauthorizedCases,
} from "./helpers";

describe("Expenses", () => {
    describe("POST /trips/:tripId/expenses", () => {
        it("should create expense and return 201", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .post(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Dinner at Tonnarello San Pietro",
                    category: "food",
                    amount: 200,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("tripId");
            expect(response.body.tripId).toBe(trip.id);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe("Dinner at Tonnarello San Pietro");
            expect(response.body).toHaveProperty("category");
            expect(response.body.category).toBe("food");
            expect(response.body).toHaveProperty("amount");
            expect(response.body.amount).toBe("200.00");
        });

        it(`should create expense with default "other" category when not provided`, async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .post(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Dinner at Tonnarello San Pietro",
                    amount: 200,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("tripId");
            expect(response.body.tripId).toBe(trip.id);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe("Dinner at Tonnarello San Pietro");
            expect(response.body).toHaveProperty("category");
            expect(response.body.category).toBe("other");
            expect(response.body).toHaveProperty("amount");
            expect(response.body.amount).toBe("200.00");
        });

        it("should return 400 when body is invalid", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .post(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: 1,
                    category: "smth",
                    amount: -200,
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 403 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const { accessToken } = await createUser();

            const response = await request(app)
                .post(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Dinner at Tonnarello San Pietro",
                    category: "food",
                    amount: 200,
                });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when trip not found", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .post("/trips/100/expenses")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Dinner at Tonnarello San Pietro",
                    category: "food",
                    amount: 200,
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Trip not found");
        });

        testUnauthorizedCases("post", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            return `/trips/${trip.id}/expenses`;
        });
    });

    describe("GET /trips/:tripId/expenses", () => {
        it("should return empty expenses array and 200 when there is no expenses", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            const response = await request(app)
                .get(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
            expect(response.body.length).toBe(0);
        });

        it("should return expenses array and 200", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            const response = await request(app)
                .get(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty("id");
            expect(response.body[0].id).toBe(expense.id);
            expect(response.body[0]).toHaveProperty("tripId");
            expect(response.body[0].tripId).toBe(trip.id);
            expect(response.body[0]).toHaveProperty("title");
            expect(response.body[0].title).toBe(expense.title);
            expect(response.body[0]).toHaveProperty("category");
            expect(response.body[0].category).toBe(expense.category);
            expect(response.body[0]).toHaveProperty("amount");
            expect(response.body[0].amount).toBe(expense.amount);
        });

        it("should return 403 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const { accessToken } = await createUser();

            const response = await request(app)
                .get(`/trips/${trip.id}/expenses`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when trip not found", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .get("/trips/100/expenses")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Trip not found");
        });

        testUnauthorizedCases("get", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());

            return `/trips/${trip.id}/expenses`;
        });
    });

    describe("GET /trips/:tripId/expenses/:expenseId", () => {
        it("should return expense and 200", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            const response = await request(app)
                .get(`/trips/${trip.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(expense.id);
            expect(response.body).toHaveProperty("tripId");
            expect(response.body.tripId).toBe(trip.id);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe(expense.title);
            expect(response.body).toHaveProperty("category");
            expect(response.body.category).toBe(expense.category);
            expect(response.body).toHaveProperty("amount");
            expect(response.body.amount).toBe(expense.amount);
        });

        it("should return 403 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const expense = await createExpense(
                ownerAccessToken,
                trip.id,
                generateExpenseData(),
            );
            const { accessToken } = await createUser();

            const response = await request(app)
                .get(`/trips/${trip.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when expense belongs to another trip", async () => {
            const { accessToken } = await createUser();
            const tripWithExpense = await createTrip(
                accessToken,
                generateTripData(),
            );
            const expense = await createExpense(
                accessToken,
                tripWithExpense.id,
                generateExpenseData(),
            );
            const tripWithoutExpense = await createTrip(
                accessToken,
                generateTripData(),
            );

            const response = await request(app)
                .get(`/trips/${tripWithoutExpense.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Expense not found");
        });

        testUnauthorizedCases("get", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            return `/trips/${trip.id}/expenses/${expense.id}`;
        });
    });

    describe("PATCH /trips/:tripId/expenses/:expenseId", () => {
        it("should update expense and return 200", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            const response = await request(app)
                .patch(`/trips/${trip.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Dinner",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(expense.id);
            expect(response.body).toHaveProperty("tripId");
            expect(response.body.tripId).toBe(trip.id);
            expect(response.body).toHaveProperty("title");
            expect(response.body.title).toBe("Dinner");
            expect(response.body).toHaveProperty("category");
            expect(response.body.category).toBe(expense.category);
            expect(response.body).toHaveProperty("amount");
            expect(response.body.amount).toBe(expense.amount);
        });

        it("should return 400 when body is empty", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            const response = await request(app)
                .patch(`/trips/${trip.id}/expenses/${expense.id}`)
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
            const expense = await createExpense(
                ownerAccessToken,
                trip.id,
                generateExpenseData(),
            );
            const { accessToken } = await createUser();

            const response = await request(app)
                .patch(`/trips/${trip.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Dinner",
                });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when expense belongs to another trip", async () => {
            const { accessToken } = await createUser();
            const tripWithExpense = await createTrip(
                accessToken,
                generateTripData(),
            );
            const expense = await createExpense(
                accessToken,
                tripWithExpense.id,
                generateExpenseData(),
            );
            const tripWithoutExpense = await createTrip(
                accessToken,
                generateTripData(),
            );

            const response = await request(app)
                .patch(`/trips/${tripWithoutExpense.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ title: "Dinner" });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Expense not found");
        });

        testUnauthorizedCases("patch", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            return `/trips/${trip.id}/expenses/${expense.id}`;
        });
    });

    describe("DELETE /trips/:tripId/expenses/:expenseId", () => {
        it("should delete expense and return 204", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            const response = await request(app)
                .delete(`/trips/${trip.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(204);
        });

        it("should return 403 when trip owner is not current user", async () => {
            const { accessToken: ownerAccessToken } = await createUser();
            const trip = await createTrip(ownerAccessToken, generateTripData());
            const expense = await createExpense(
                ownerAccessToken,
                trip.id,
                generateExpenseData(),
            );
            const { accessToken } = await createUser();

            const response = await request(app)
                .delete(`/trips/${trip.id}/expenses/${expense.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "error",
                "Access denied for this trip",
            );
        });

        it("should return 404 when expense belongs to another trip", async () => {
            const { accessToken } = await createUser();
            const tripWithExpense = await createTrip(
                accessToken,
                generateTripData(),
            );
            const expense = await createExpense(
                accessToken,
                tripWithExpense.id,
                generateExpenseData(),
            );
            const tripWithoutExpense = await createTrip(
                accessToken,
                generateTripData(),
            );

            const response = await request(app)
                .delete(
                    `/trips/${tripWithoutExpense.id}/expenses/${expense.id}`,
                )
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Expense not found");
        });

        testUnauthorizedCases("delete", async () => {
            const { accessToken } = await createUser();
            const trip = await createTrip(accessToken, generateTripData());
            const expense = await createExpense(
                accessToken,
                trip.id,
                generateExpenseData(),
            );

            return `/trips/${trip.id}/expenses/${expense.id}`;
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
