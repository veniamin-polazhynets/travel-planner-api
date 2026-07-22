import request, { Response } from "supertest";
import { app } from "../app";
import { CreateTripDto } from "../validation/trips";
import { RegistrationDto } from "../validation/users";

export const generateCredentials = () => {
    const random = Date.now().toString();

    const credentials = {
        email: `user${random}@gmail.com`,
        username: `User${random}`,
        password: `${random}`,
    };

    return credentials;
};

export const registerUser = async (credentials: RegistrationDto) => {
    return await request(app).post("/auth/register").send(credentials);
};

export const createUser = async () => {
    const credentials = generateCredentials();
    const regResponse = await registerUser(credentials);

    return {
        credentials,
        user: regResponse.body.user,
        accessToken: regResponse.body.accessToken,
        regResponse,
    };
};

export const generateTripData = (
    overrides?: Partial<CreateTripDto>,
    index?: number,
) => {
    const random = Date.now().toString() + (index ?? "");

    const tripData = {
        title: `Trip to Italy ${random}`,
        country: "Italy",
        city: "Rome",
        startDate: "2026-06-01",
        endDate: "2026-06-30",
        budget: 1000 + (index ?? 0),
    };

    return { ...tripData, ...overrides };
};

export const createTrip = async (
    accessToken: string,
    tripData: CreateTripDto,
) => {
    const response = await request(app)
        .post("/trips")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(tripData);

    return response.body;
};

export const createManyTrips = async (accessToken: string, count: number) => {
    for (let i = 0; i < count; i++) {
        const tripData = generateTripData(undefined, i);
        await createTrip(accessToken, tripData);
    }
};

export const expectTripsListData = (
    response: Response,
    dataLength?: number,
) => {
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("meta");
    if (dataLength !== undefined) {
        expect(response.body.data.length).toBe(dataLength);
    } else {
        expect(response.body.data).toEqual([]);
    }
};

export const expectTripsListMeta = (
    response: Response,
    totalItems?: number,
    totalPages?: number,
    currentPage?: number,
    pageSize?: number,
) => {
    expect(response.body.meta).toHaveProperty("totalItems");
    expect(response.body.meta).toHaveProperty("totalPages");
    expect(response.body.meta).toHaveProperty("currentPage");
    expect(response.body.meta).toHaveProperty("pageSize");
    if (totalItems !== undefined) {
        expect(response.body.meta.totalItems).toBe(totalItems);
    }
    if (totalPages !== undefined) {
        expect(response.body.meta.totalPages).toBe(totalPages);
    }
    if (currentPage !== undefined) {
        expect(response.body.meta.currentPage).toBe(currentPage);
    }
    if (pageSize !== undefined) {
        expect(response.body.meta.pageSize).toBe(pageSize);
    }
};

export const testUnauthorizedCases = (
    method: "post" | "get" | "patch" | "delete",
    url: string | (() => Promise<string>),
) => {
    const getUrl = async (): Promise<string> => {
        if (typeof url === "string") {
            return url;
        }
        return await url();
    };

    it("should return 401 when authorization header is not provided", async () => {
        const url = await getUrl();

        const response = await request(app)[method](url);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
            "error",
            "Authorization header not provided",
        );
    });

    it("should return 401 when authorization type is invalid", async () => {
        const url = await getUrl();
        const { accessToken } = await createUser();

        const response = await request(app)
            [method](url)
            .set("Authorization", `Basic ${accessToken}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
            "error",
            "Invalid authorization type",
        );
    });

    it("should return 401 when access token is not provided", async () => {
        const url = await getUrl();

        const response = await request(app)
            [method](url)
            .set("Authorization", `Bearer `);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
            "error",
            "Access token not provided",
        );
    });

    it("should return 401 when access token is invalid or expired", async () => {
        const url = await getUrl();
        const { accessToken } = await createUser();

        const response = await request(app)
            [method](url)
            .set("Authorization", `Bearer ${accessToken + 1}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
            "error",
            "Invalid or expired token",
        );
    });

    it("should return 401 when user no longer exists", async () => {
        const url = await getUrl();
        const { accessToken, credentials } = await createUser();

        await request(app)
            .delete("/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ password: credentials.password });

        const response = await request(app)
            [method](url)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "User no longer exists");
    });
};
