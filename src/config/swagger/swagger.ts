import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { authSwagger } from "../../routers/auth.swagger";
import { usersSwagger } from "../../routers/users.swagger";
import {
    deleteUserSchema,
    loginSchema,
    registrationSchema,
    updateUserSchema,
    userResponseSchema,
} from "../../validation/users";
import { tripsSwagger } from "../../routers/trips.swagger";
import {
    createTripSchema,
    tripResponseSchema,
    tripsArrayResponseSchema,
    updateTripSchema,
} from "../../validation/trips";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

registry.register("RegistrationRequest", registrationSchema);
registry.register("LoginRequest", loginSchema);
registry.register("UserResponse", userResponseSchema);
registry.register("UpdateUserRequest", updateUserSchema);
registry.register("DeleteUserRequest", deleteUserSchema);
registry.register("CreateTripRequest", createTripSchema);
registry.register("UpdateTripRequest", updateTripSchema);
registry.register("TripResponse", tripResponseSchema);
registry.register("TripsArrayResponse", tripsArrayResponseSchema);

authSwagger.forEach((route) => {
    registry.registerPath(route);
});
usersSwagger.forEach((route) => {
    registry.registerPath(route);
});
tripsSwagger.forEach((route) => {
    registry.registerPath(route);
});

export function setupSwagger(app: Express) {
    const generator = new OpenApiGeneratorV3(registry.definitions);

    const openApiDocument = generator.generateDocument({
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Travel Planner API",
            description:
                "Interactive API documentation for Travel Planner application",
        },
    });

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}
