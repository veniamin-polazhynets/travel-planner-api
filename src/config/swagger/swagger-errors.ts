import { z } from "zod";

export const baseErrorSchema = z.object({
    statusCode: z.number(),
    isOperational: z.boolean().openapi({ example: true }),
    error: z.string(),
    stack: z.string().optional().openapi({
        description: "Error stack trace (only in development mode)",
    }),
});

export const validationErrorSchema = baseErrorSchema.extend({
    details: z
        .array(
            z.object({
                field: z.string().openapi({ example: "email" }),
                message: z
                    .string()
                    .openapi({ example: "Invalid email address" }),
            }),
        )
        .openapi({
            description: "Validation error details (field-specific)",
        }),
});

export const badRequestResponse = {
    description: "Validation error",
    content: {
        "application/json": {
            schema: validationErrorSchema.extend({
                statusCode: z.number().openapi({ example: 400 }),
                error: z.string().openapi({ example: "Validation error" }),
            }),
        },
    },
};

export const unauthorizedResponse = {
    description: "Missing, invalid or expired token",
    content: {
        "application/json": {
            schema: baseErrorSchema.extend({
                statusCode: z.number().openapi({ example: 401 }),
                error: z
                    .string()
                    .openapi({ example: "Invalid or expired token" }),
            }),
        },
    },
};

export const forbiddenResponse = {
    description: "Access denied for this resource",
    content: {
        "application/json": {
            schema: baseErrorSchema.extend({
                statusCode: z.number().openapi({ example: 403 }),
                error: z
                    .string()
                    .openapi({ example: "Access denied for this trip" }),
            }),
        },
    },
};

export const notFoundResponse = {
    description: "Resource does not exist",
    content: {
        "application/json": {
            schema: baseErrorSchema.extend({
                statusCode: z.number().openapi({ example: 404 }),
                error: z.string().openapi({ example: "Trip not found" }),
            }),
        },
    },
};

export const conflictResponse = {
    description: "Conflict with the current state of the server",
    content: {
        "application/json": {
            schema: baseErrorSchema.extend({
                statusCode: z.number().openapi({ example: 409 }),
                error: z
                    .string()
                    .openapi({ example: "This email already exists" }),
            }),
        },
    },
};

export const tooManyRequestsResponse = {
    description: "Too many requests, rate limit exceeded",
    content: {
        "application/json": {
            schema: baseErrorSchema.extend({
                statusCode: z.number().openapi({ example: 429 }),
                error: z.string().openapi({
                    example: "Too many attempts. Please try again later",
                }),
            }),
        },
    },
};
