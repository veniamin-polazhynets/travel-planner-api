import request from "supertest";
import { RegistrationDto } from "../validation/users";
import { app } from "../app";

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
