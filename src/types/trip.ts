export type CreateTripDao = {
    userId: number;
    title: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    budget: string;
};

export type Trip = {
    id: number;
    userId: number;
    title: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    budget: string;
    createdAt: Date;
    updatedAt: Date;
};

export type TripResponse = Omit<Trip, "userId" | "createdAt" | "updatedAt">;
