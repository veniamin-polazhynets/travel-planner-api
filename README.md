# 🌍 Travel Planner API

[![Node.js](https://img.shields.io/badge/20.x-green?style=flat&logo=Node.js&logoColor=green&label=Node.js&color=green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.45-green?logo=drizzle)](https://orm.drizzle.team/)
[![JWT](https://img.shields.io/badge/JWT-9.x-black?logo=jsonwebtokens)](https://www.jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-3.x-blue?logo=zod)](https://zod.dev/)
[![Swagger UI](https://img.shields.io/badge/Swagger_UI-5.x-green?logo=swagger)](http://swagger.io/)
[![Tests](https://img.shields.io/badge/Tests-138%20Passed-brightgreen?logo=jest)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)

A RESTful API built with **Node**, **TypeScript**, **Express**, and **PostgreSQL**. Designed to allow users to plan their trips and track travel expenses. Features comprehensive security, automated Swagger documentation via Zod, and full integration test coverage.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT
- **Validation:** Zod
- **Documentation:** Swagger UI, `@asteasolutions/zod-to-openapi`
- **Testing:** Jest, Supertest
- **DevOps:** Docker, Docker Compose

## Features

- Full CRUD for trips and expenses.
- JWT authentication with `httpOnly` Refresh Token in Cookie & short-lived Access Tokens.
- Session invalidation via `tokenVersion`.
- Brute-force protection with custom Rate Limiting.
- Secure HTTP headers using Helmet and strict CORS policy.
- Clean Layered Architecture (`Routers -> Controllers -> Services -> Repositories`).
- Protected routes with authorization.
- User profile management.
- Efficient pagination with metadata and optimized search/sorting for trips.
- Input validation using Zod for requests, queries, and path parameters with unified `res.locals` type-safety.
- Automatically generated Swagger documentation directly from Zod schemas.
- Centralized error handling with custom errors.
- 138 integration tests covering 100% of business logic and edge-cases using Jest & Supertest.
- Containerization with Docker & Docker Compose.

## Live Demo & Documentation

Interactive API documentation (Swagger UI) is deployed and available online:
👉 **[Live Swagger Documentation](https://travel-planner-api-db5k.onrender.com/api-docs)**

> **Note:** Hosted on the Render free tier. If the service has been inactive, the first request may take ~30–40 seconds to spin up from sleep mode.

## API Endpoints

> **Note:** Endpoints marked as *(auth required)* require a valid Access Token in the `Authorization: Bearer <token>` header.

### Auth
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in and receive tokens
- `POST /auth/refresh` - Refresh access token via cookie
- `POST /auth/logout` *(auth required)* - Invalidate session and clear cookie

### Users *(auth required)*
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile
- `DELETE /users/me` - Delete user account

### Trips *(auth required)*
- `POST /trips` - Create a new trip
- `GET /trips` - Get paginated list of trips (supports search, filters, sorting)
- `GET /trips/:tripId` - Get trip details by ID
- `PATCH /trips/:tripId` - Update trip details
- `DELETE /trips/:tripId` - Delete trip

### Expenses *(auth required)*
- `POST /trips/:tripId/expenses` - Add expense to trip
- `GET /trips/:tripId/expenses` - Get all expenses for a trip
- `GET /trips/:tripId/expenses/:expenseId` - Get expense details by ID
- `PATCH /trips/:tripId/expenses/:expenseId` - Update expense details
- `DELETE /trips/:tripId/expenses/:expenseId` - Delete expense

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/veniamin-polazhynets/travel-planner-api.git
cd travel-planner-api
```

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://your-user:your-password@localhost:5432/travel_planner
ACCESS_TOKEN_SECRET=your-access-token-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
CLIENT_URL=http://localhost:5000
```

For automated testing, create a `.env.test` file:
```env
NODE_ENV=test
PORT=8001
DATABASE_URL=postgresql://your-user:your-password@localhost:5432/test_travel_planner
ACCESS_TOKEN_SECRET=your-access-token-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
CLIENT_URL=http://localhost:5000
```

### 3. Install Dependencies
If you want to run tests or develop locally outside of Docker, install the packages:
```bash
yarn install
```

### 4. Run via Docker Compose (Recommended)
You can start the entire application and PostgreSQL database with a single command:
```bash
docker compose up --build
```
The API will be available at `http://localhost:8000`, and Swagger documentation at `http://localhost:8000/api-docs`.

### 5. Run Tests
```bash
yarn test
```