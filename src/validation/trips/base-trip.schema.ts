import { z } from "zod";

export const baseTripSchema = z.object({
    title: z.string().trim().min(3).max(100).openapi({
        description: "Trip title or destination focus",
        example: "Summer Trip to Italy",
    }),
    country: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .openapi({ description: "Destination country", example: "Italy" }),
    city: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .openapi({ description: "Destination city", example: "Rome" }),
    startDate: z.string().trim().date().openapi({
        description: "Trip start date (YYYY-MM-DD)",
        example: "2026-06-01",
    }),
    endDate: z.string().trim().date().openapi({
        description:
            "Trip end date (YYYY-MM-DD). Must be greater than or equal to start date",
        example: "2026-06-30",
    }),
    budget: z
        .number()
        .positive()
        .openapi({ description: "Trip budget in USD", example: 1500.0 }),
});

export const validateDates = (startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return end >= start;
    }
    return true;
};
