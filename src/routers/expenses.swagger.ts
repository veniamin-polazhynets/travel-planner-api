import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
    unauthorizedResponse,
} from "../config/swagger/swagger-errors";
import {
    createExpenseSchema,
    expenseArrayResponseSchema,
    expenseParamsSchema,
    expenseResponseSchema,
    updateExpenseSchema,
} from "../validation/expenses";
import { tripParamsSchema } from "../validation/trips";

export const expensesSwagger: RouteConfig[] = [
    {
        method: "post",
        path: "/trips/{tripId}/expenses",
        summary: "Create Expense",
        tags: ["Expenses"],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: createExpenseSchema,
                    },
                },
            },
            params: tripParamsSchema,
        },
        responses: {
            201: {
                description: "Successfully created expense",
                content: {
                    "application/json": {
                        schema: expenseResponseSchema,
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
        method: "get",
        path: "/trips/{tripId}/expenses",
        summary: "Get Trip Expenses",
        tags: ["Expenses"],
        security: [{ bearerAuth: [] }],
        request: {
            params: tripParamsSchema,
        },
        responses: {
            200: {
                description: "Successfully returned trip expenses",
                content: {
                    "application/json": {
                        schema: expenseArrayResponseSchema,
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
        method: "get",
        path: "/trips/{tripId}/expenses/{expenseId}",
        summary: "Get Expense By Id",
        tags: ["Expenses"],
        security: [{ bearerAuth: [] }],
        request: {
            params: expenseParamsSchema,
        },
        responses: {
            200: {
                description: "Successfully returned expense",
                content: {
                    "application/json": {
                        schema: expenseResponseSchema,
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
        path: "/trips/{tripId}/expenses/{expenseId}",
        summary: "Update Expense",
        tags: ["Expenses"],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: updateExpenseSchema,
                    },
                },
            },
            params: expenseParamsSchema,
        },
        responses: {
            200: {
                description: "Successfully updated expense",
                content: {
                    "application/json": {
                        schema: expenseResponseSchema,
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
        path: "/trips/{tripId}/expenses/{expenseId}",
        summary: "Delete Expense",
        tags: ["Expenses"],
        security: [{ bearerAuth: [] }],
        request: {
            params: expenseParamsSchema,
        },
        responses: {
            204: {
                description: "Successfully deleted expense",
            },
            400: badRequestResponse,
            401: unauthorizedResponse,
            403: forbiddenResponse,
            404: notFoundResponse,
        },
    },
];
