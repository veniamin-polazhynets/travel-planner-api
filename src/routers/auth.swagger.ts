import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import {
    badRequestResponse,
    conflictResponse,
    tooManyRequestsResponse,
    unauthorizedResponse,
} from "../config/swagger/swagger-errors";
import {
    loginSchema,
    registrationSchema,
    userResponseSchema,
} from "../validation/users";

export const authSwagger: RouteConfig[] = [
    {
        method: "post",
        path: "/auth/register",
        summary: "Registration",
        tags: ["Auth"],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: registrationSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Successfully registered new user",
                content: {
                    "application/json": {
                        schema: z.object({
                            user: userResponseSchema,
                            accessToken: z.string().openapi({
                                description:
                                    "User access token for protected routes to paste into Authorization header",
                                example: "ehFDjqPioSJ...",
                            }),
                        }),
                    },
                },
            },
            400: badRequestResponse,
            409: conflictResponse,
            429: tooManyRequestsResponse,
        },
    },

    {
        method: "post",
        path: "/auth/login",
        summary: "Log In",
        tags: ["Auth"],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: loginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Successfully logged in",
                content: {
                    "application/json": {
                        schema: z.object({
                            user: userResponseSchema,
                            accessToken: z.string().openapi({
                                description:
                                    "User access token for protected routes to paste into Authorization header",
                                example: "ehFDjqPioSJ...",
                            }),
                        }),
                    },
                },
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
            429: tooManyRequestsResponse,
        },
    },

    {
        method: "post",
        path: "/auth/refresh",
        summary: "Refresh",
        tags: ["Auth"],
        request: {
            cookies: z.object({
                refreshToken: z.string().openapi({
                    description: "Refresh token stored in httpOnly cookie",
                    example: "eyJhbGciOi...",
                }),
            }),
        },
        responses: {
            200: {
                description: "Successfully refreshed access token",
                content: {
                    "application/json": {
                        schema: z.object({
                            accessToken: z.string().openapi({
                                description:
                                    "User access token for protected routes to paste into Authorization header",
                                example: "ehFDjqPioSJ...",
                            }),
                        }),
                    },
                },
            },
            401: unauthorizedResponse,
        },
    },

    {
        method: "post",
        path: "/auth/logout",
        summary: "Log Out",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: "Successfully logged out",
                content: {
                    "application/json": {
                        schema: z.object({
                            logoutMessage: z.string().openapi({
                                example: "Successfully logged out",
                            }),
                        }),
                    },
                },
            },
            401: unauthorizedResponse,
        },
    },
];
