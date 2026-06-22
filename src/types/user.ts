export type User = {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    tokenVersion: number;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateUserDao = {
    username: string;
    email: string;
    passwordHash: string;
};

export type UpdateUserDao = Partial<Omit<CreateUserDao, "passwordHash">>;

export type UserResponse = Omit<
    User,
    "passwordHash" | "tokenVersion" | "createdAt" | "updatedAt"
>;

export type AuthResponse = {
    user: UserResponse;
    refreshToken: string;
    accessToken: string;
};
