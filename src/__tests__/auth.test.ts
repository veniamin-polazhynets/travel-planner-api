import request from "supertest";
import { db } from "../db/db";
import { sql } from "drizzle-orm";
import { app } from "../app";
import {
    createUser,
    generateCredentials,
    registerUser,
    testUnauthorizedCases,
} from "./helpers";

describe("Auth", () => {
    describe("POST /auth/register", () => {
        it("should create user and return 201", async () => {
            const response = await request(app).post("/auth/register").send({
                email: "user@gmail.com",
                username: "User",
                password: "12345678",
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toHaveProperty("id");
            expect(response.body.user.id).toBe(1);
            expect(response.body.user).toHaveProperty("email");
            expect(response.body.user.email).toBe("user@gmail.com");
            expect(response.body.user).toHaveProperty("username");
            expect(response.body.user.username).toBe("User");
            expect(response.body).toHaveProperty("accessToken");
        });

        it("should return 400 when email is invalid", async () => {
            const credentials = generateCredentials();

            const response = await registerUser({
                email: "usergmail.com",
                username: credentials.username,
                password: credentials.password,
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 400 when username is invalid", async () => {
            const credentials = generateCredentials();

            const response = await registerUser({
                email: credentials.email,
                username: "U",
                password: credentials.password,
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 400 when password is invalid", async () => {
            const credentials = generateCredentials();

            const response = await registerUser({
                email: credentials.email,
                username: credentials.username,
                password: "1234",
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 409 when email already exists", async () => {
            const firstUserCredentials = generateCredentials();
            await registerUser(firstUserCredentials);
            const secondUserCredentials = generateCredentials();

            const response = await registerUser({
                email: firstUserCredentials.email,
                username: secondUserCredentials.username,
                password: secondUserCredentials.password,
            });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty(
                "error",
                "This email already exists",
            );
        });

        it("should return 409 when username already exists", async () => {
            const firstUserCredentials = generateCredentials();
            await registerUser(firstUserCredentials);
            const secondUserCredentials = generateCredentials();

            const response = await registerUser({
                email: secondUserCredentials.email,
                username: firstUserCredentials.username,
                password: secondUserCredentials.password,
            });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty(
                "error",
                "This username already exists",
            );
        });
    });

    describe("POST /auth/login", () => {
        it("should return user profile, access token, and 200", async () => {
            const { credentials } = await createUser();

            const response = await request(app).post("/auth/login").send({
                email: credentials.email,
                password: credentials.password,
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toHaveProperty("id");
            expect(response.body.user.id).toBe(1);
            expect(response.body.user).toHaveProperty("email");
            expect(response.body.user.email).toBe(credentials.email);
            expect(response.body.user).toHaveProperty("username");
            expect(response.body.user.username).toBe(credentials.username);
            expect(response.body).toHaveProperty("accessToken");
        });

        it("should return 400 when email is invalid", async () => {
            const { credentials } = await createUser();

            const response = await request(app).post("/auth/login").send({
                email: "usergmail.com",
                password: credentials.password,
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 400 when password is invalid", async () => {
            const { credentials } = await createUser();

            const response = await request(app).post("/auth/login").send({
                email: credentials.email,
                password: "1234",
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Validation error");
        });

        it("should return 401 when email does not exist", async () => {
            const { credentials } = await createUser();

            const response = await request(app).post("/auth/login").send({
                email: "user@gmail.com",
                password: credentials.password,
            });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "error",
                "Invalid email or password",
            );
        });

        it("should return 401 when password is incorrect", async () => {
            const { credentials } = await createUser();

            const response = await request(app).post("/auth/login").send({
                email: credentials.email,
                password: "12345678",
            });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "error",
                "Invalid email or password",
            );
        });
    });

    describe("POST /auth/refresh", () => {
        it("should refresh access token and return 200", async () => {
            const credentials = generateCredentials();
            const registerRes = await registerUser(credentials);
            const cookies = registerRes.headers["set-cookie"];

            const response = await request(app)
                .post("/auth/refresh")
                .set("Cookie", cookies)
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("accessToken");
        });

        it("should return 401 when refresh token is not provided", async () => {
            const response = await request(app).post("/auth/refresh").send();

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "error",
                "Refresh token not provided",
            );
        });

        it("should return 401 when refresh token is invalid", async () => {
            const response = await request(app)
                .post("/auth/refresh")
                .set("Cookie", ["refreshToken=invalid_token_123"])
                .send();

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "error",
                "Invalid or expired token",
            );
        });
    });

    describe("POST /auth/logout", () => {
        it("should log out user, clear cookie and return 200", async () => {
            const { accessToken, regResponse } = await createUser();
            const cookies = regResponse.headers["set-cookie"];

            const response = await request(app)
                .post("/auth/logout")
                .set("Cookie", cookies)
                .set("Authorization", `Bearer ${accessToken}`)
                .send();
            const clearedCookies = response.headers["set-cookie"];

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("logoutMessage");
            expect(response.body.logoutMessage).toBe("Successfully logged out");
            expect(clearedCookies).toBeDefined();
            expect(clearedCookies[0]).toContain("refreshToken=;");
            expect(clearedCookies[0]).toContain(
                "Expires=Thu, 01 Jan 1970 00:00:00 GMT;",
            );
        });

        testUnauthorizedCases("post", "/auth/logout");
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
