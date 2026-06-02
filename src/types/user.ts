export type CreateUserDao = {
    username: string;
    email: string;
    passwordHash: string;
};

export type User = {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    tokenVersion: number;
};

export type UserResponse = {
    id: number;
    username: string;
    email: string;
};

export type AuthResponse = {
    user: UserResponse;
    refreshToken: string;
    accessToken: string;
};

export type UpdateUserDao = {
    username?: string;
    email?: string;
};
