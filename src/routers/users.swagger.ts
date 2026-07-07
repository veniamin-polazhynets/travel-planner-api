import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import {
    badRequestResponse,
    notFoundResponse,
    unauthorizedResponse,
} from "../config/swagger/swagger-errors";
import {
    deleteUserSchema,
    updateUserSchema,
    userResponseSchema,
} from "../validation/users";

export const usersSwagger: RouteConfig[] = [
    {
        method: "get",
        path: "/users/me",
        summary: "Get Current User Profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: "Successfully returned user profile",
                content: {
                    "application/json": {
                        schema: userResponseSchema,
                    },
                },
            },
            401: unauthorizedResponse,
            404: notFoundResponse,
        },
    },

    {
        method: "patch",
        path: "/users/me",
        summary: "Update Current User Profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: updateUserSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Successfully updated user profile",
                content: {
                    "application/json": {
                        schema: userResponseSchema,
                    },
                },
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
            404: notFoundResponse,
        },
    },

    {
        method: "delete",
        path: "/users/me",
        summary: "Delete Current User Account",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: deleteUserSchema,
                    },
                },
            },
        },
        responses: {
            204: {
                description: "Successfully deleted user account",
            },
            401: unauthorizedResponse,
            404: notFoundResponse,
        },
    },
];
