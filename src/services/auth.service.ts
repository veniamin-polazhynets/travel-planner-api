import { ConflictError, UnauthorizedError } from "../errors/http.errors";
import { usersRepository } from "../repositories/users.repository";
import { AuthResponse, UserResponse } from "../types/user";
import { bcryptHelper } from "../utils/hash";
import { RegistrationDto } from "../validation/users/registration.schema";
import { jwtHelper } from "../utils/jwt";
import { JWTPayload } from "../types/jwt";
import { LoginDto } from "../validation/users/login.schema";

export const authService = {
    async register(dto: RegistrationDto): Promise<AuthResponse> {
        const existingEmail = await usersRepository.findByEmail(dto.email);

        if (existingEmail) {
            throw new ConflictError("This email already exists");
        }

        const existingUsername = await usersRepository.findByUsername(
            dto.username,
        );

        if (existingUsername) {
            throw new ConflictError("This username already exists");
        }

        const hashedPassword = await bcryptHelper.hashPassword(dto.password);

        const user = await usersRepository.createUser({
            username: dto.username,
            email: dto.email,
            passwordHash: hashedPassword,
        });

        const payload: JWTPayload = {
            userId: user.id,
            tokenVersion: user.tokenVersion,
        };

        const refreshToken = jwtHelper.createRefreshToken(payload);

        const accessToken = jwtHelper.createAccessToken(payload);

        const userResponse: UserResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        return {
            user: userResponse,
            refreshToken,
            accessToken,
        };
    },

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await usersRepository.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const isPasswordValid = await bcryptHelper.comparePasswords(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const payload: JWTPayload = {
            userId: user.id,
            tokenVersion: user.tokenVersion,
        };

        const refreshToken = jwtHelper.createRefreshToken(payload);

        const accessToken = jwtHelper.createAccessToken(payload);

        const userResponse: UserResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        return {
            user: userResponse,
            refreshToken,
            accessToken,
        };
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = jwtHelper.verifyRefreshToken(refreshToken);

        const user = await usersRepository.findById(payload.userId);

        if (!user) {
            throw new UnauthorizedError("User not found");
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        const newPayload: JWTPayload = {
            userId: user.id,
            tokenVersion: user.tokenVersion,
        };

        const accessToken = jwtHelper.createAccessToken(newPayload);

        return { accessToken };
    },

    async logout(userId: number): Promise<{ logoutMessage: string }> {
        await usersRepository.incrementTokenVersion(userId);

        return {
            logoutMessage: "Successfully logged out",
        };
    },
};
