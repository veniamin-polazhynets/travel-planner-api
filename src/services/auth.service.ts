import { ConflictError, UnauthorizedError } from "../errors/http.errors";
import { usersRepository } from "../repositories/users.repository";
import { JWTPayload } from "../types/jwt";
import { AuthResponse } from "../types/user";
import { bcryptHelper } from "../utils/hash";
import { jwtHelper } from "../utils/jwt";
import { mapToUserResponse } from "../utils/mappers/user-mapper";
import { LoginDto, RegistrationDto } from "../validation/users";

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
        const user = await usersRepository.create({
            username: dto.username,
            email: dto.email,
            passwordHash: hashedPassword,
        });

        const payload: JWTPayload = {
            id: user.id,
            tokenVersion: user.tokenVersion,
        };
        const refreshToken = jwtHelper.createRefreshToken(payload);
        const accessToken = jwtHelper.createAccessToken(payload);

        const userResponse = mapToUserResponse(user);
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
            id: user.id,
            tokenVersion: user.tokenVersion,
        };
        const refreshToken = jwtHelper.createRefreshToken(payload);
        const accessToken = jwtHelper.createAccessToken(payload);

        const userResponse = mapToUserResponse(user);
        return {
            user: userResponse,
            refreshToken,
            accessToken,
        };
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = jwtHelper.verifyRefreshToken(refreshToken);

        const user = await usersRepository.findById(payload.id);
        if (!user) {
            throw new UnauthorizedError("User not found");
        }
        if (user.tokenVersion !== payload.tokenVersion) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        const newPayload: JWTPayload = {
            id: user.id,
            tokenVersion: user.tokenVersion,
        };
        const accessToken = jwtHelper.createAccessToken(newPayload);

        return { accessToken };
    },

    async logout(id: number): Promise<{ logoutMessage: string }> {
        await usersRepository.incrementTokenVersion(id);
        return {
            logoutMessage: "Successfully logged out",
        };
    },
};
