import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const registry = new OpenAPIRegistry();

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
