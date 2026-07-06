import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { registrationSchema } from "../../validation/users";
import { authSwagger } from "../../routers/auth.swagger";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

registry.register("Registration", registrationSchema);

authSwagger.forEach((route) => {
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
