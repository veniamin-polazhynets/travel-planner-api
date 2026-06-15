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

export type UpdateTripDao = Partial<Omit<CreateTripDao, "userId">>;

export type TripArrayResponse = {
    data: TripResponse[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
};

export type QueryTripsDao = {
    page: number;
    limit: number;
    search?: string;
    country?: string;
    city?: string;
    sortBy: "startDate" | "endDate" | "budget" | "createdAt";
    order: "asc" | "desc";
};
