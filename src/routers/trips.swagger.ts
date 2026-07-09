import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
    unauthorizedResponse,
} from "../config/swagger/swagger-errors";
import {
    createTripSchema,
    queryTripsSchema,
    tripParamsSchema,
    tripResponseSchema,
    tripsArrayResponseSchema,
    updateTripSchema,
} from "../validation/trips";

export const tripsSwagger: RouteConfig[] = [
    {
        method: "post",
        path: "/trips",
        summary: "Create Trip",
        tags: ["Trips"],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: createTripSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Successfully created trip",
                content: {
                    "application/json": {
                        schema: tripResponseSchema,
                    },
                },
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
        },
    },

    {
        method: "get",
        path: "/trips",
        summary: "Get Current User Trips",
        tags: ["Trips"],
        security: [{ bearerAuth: [] }],
        request: {
            query: queryTripsSchema,
        },
        responses: {
            200: {
                description: "Successfully returned user trips",
                content: {
                    "application/json": {
                        schema: tripsArrayResponseSchema,
                    },
                },
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
        },
    },

    {
        method: "get",
        path: "/trips/{tripId}",
        summary: "Get Trip By Id",
        tags: ["Trips"],
        security: [{ bearerAuth: [] }],
        request: {
            params: tripParamsSchema,
        },
        responses: {
            200: {
                description: "Successfully returned trip",
                content: {
                    "application/json": {
                        schema: tripResponseSchema,
                    },
                },
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
            403: forbiddenResponse,
            404: notFoundResponse,
        },
    },

    {
        method: "patch",
        path: "/trips/{tripId}",
        summary: "Update Trip",
        tags: ["Trips"],
        security: [{ bearerAuth: [] }],
        request: {
            params: tripParamsSchema,
            body: {
                content: {
                    "application/json": { schema: updateTripSchema },
                },
            },
        },
        responses: {
            200: {
                description: "Successfully updated trip",
                content: {
                    "application/json": {
                        schema: tripResponseSchema,
                    },
                },
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
            403: forbiddenResponse,
            404: notFoundResponse,
        },
    },

    {
        method: "delete",
        path: "/trips/{tripId}",
        summary: "Delete Trip",
        tags: ["Trips"],
        security: [{ bearerAuth: [] }],
        request: {
            params: tripParamsSchema,
        },
        responses: {
            204: {
                description: "Successfully deleted trip",
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
            403: forbiddenResponse,
            404: notFoundResponse,
        },
    },
];
