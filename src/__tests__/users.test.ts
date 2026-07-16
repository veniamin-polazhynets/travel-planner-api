import { sql } from "drizzle-orm";
import request from "supertest";
import { app } from "../app";
import { db } from "../db/db";
import { createUser, testUnauthorizedCases } from "./helpers";

describe("Users", () => {
    describe("GET /users/me", () => {
        it("should return current user profile and 200", async () => {
            const { credentials, accessToken } = await createUser();

            const response = await request(app)
                .get("/users/me")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("email");
            expect(response.body.email).toBe(credentials.email);
            expect(response.body).toHaveProperty("username");
            expect(response.body.username).toBe(credentials.username);
        });

        testUnauthorizedCases("get", "/users/me");
    });

    describe("PATCH /users/me", () => {
        it("should update current user profile and return 200", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .patch("/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    email: "user@gmail.com",
                    username: "User",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("email");
            expect(response.body.email).toBe("user@gmail.com");
            expect(response.body).toHaveProperty("username");
            expect(response.body.username).toBe("User");
        });

        it("should update only email and return 200", async () => {
            const { credentials, accessToken } = await createUser();

            const response = await request(app)
                .patch("/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    email: "user@gmail.com",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("email");
            expect(response.body.email).toBe("user@gmail.com");
            expect(response.body).toHaveProperty("username");
            expect(response.body.username).toBe(credentials.username);
        });

        it("should update only username and return 200", async () => {
            const { credentials, accessToken } = await createUser();

            const response = await request(app)
                .patch("/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    username: "User",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("email");
            expect(response.body.email).toBe(credentials.email);
            expect(response.body).toHaveProperty("username");
            expect(response.body.username).toBe("User");
        });

        it("should return 400 when body is empty", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .patch("/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
            expect(response.body.details[0].message).toBe(
                "Body must contain at least one field to update",
            );
        });

        it("should return 409 when email for update already exists", async () => {
            const { accessToken: currentUserAccessToken } = await createUser();
            const { credentials: ownerCredentials } = await createUser();

            const response = await request(app)
                .patch("/users/me")
                .set("Authorization", `Bearer ${currentUserAccessToken}`)
                .send({ email: ownerCredentials.email });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty(
                "error",
                "This email already exists",
            );
        });

        it("should return 409 when username for update already exists", async () => {
            const { accessToken: currentUserAccessToken } = await createUser();
            const { credentials: ownerCredentials } = await createUser();

            const response = await request(app)
                .patch("/users/me")
                .set("Authorization", `Bearer ${currentUserAccessToken}`)
                .send({ username: ownerCredentials.username });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty(
                "error",
                "This username already exists",
            );
        });

        testUnauthorizedCases("patch", "/users/me");
    });

    describe("DELETE /users/me", () => {
        it("should delete current user account and return 204", async () => {
            const { credentials, accessToken } = await createUser();

            const response = await request(app)
                .delete("/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    password: credentials.password,
                });

            expect(response.status).toBe(204);
        });

        it("should return 401 when password is incorrect", async () => {
            const { accessToken } = await createUser();

            const response = await request(app)
                .delete("/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    password: "12345678",
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("error", "Incorrect password");
        });

        testUnauthorizedCases("delete", "/users/me");
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
