import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/http.errors";
import { usersRepository } from "../repositories/users.repository";
import { UserResponse } from "../types/user";
import { bcryptHelper } from "../utils/hash";
import { DeleteUserDto } from "../validation/users/delete-user.schema";
import { UpdateUserDto } from "../validation/users/update-user.schema";

export const usersService = {
    async getUserProfile(userId: number): Promise<UserResponse> {
        const user = await usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    },

    async updateUserProfile(
        userId: number,
        dto: UpdateUserDto,
    ): Promise<UserResponse> {
        if (dto.username === undefined && dto.email === undefined) {
            throw new BadRequestError("Nothing to update");
        }

        if (dto.email) {
            const existing = await usersRepository.findByEmail(dto.email);
            if (existing && existing.id !== userId) {
                throw new ConflictError("This email already exists");
            }
        }

        if (dto.username) {
            const existing = await usersRepository.findByUsername(dto.username);
            if (existing && existing.id !== userId) {
                throw new ConflictError("This username already exists");
            }
        }

        const updatedUser = await usersRepository.updateUser(userId, dto);

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
        };
    },

    async deleteUserProfile(userId: number, dto: DeleteUserDto): Promise<void> {
        const user = await usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isPasswordValid = await bcryptHelper.comparePasswords(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid password");
        }

        return await usersRepository.deleteUser(userId);
    },
};
