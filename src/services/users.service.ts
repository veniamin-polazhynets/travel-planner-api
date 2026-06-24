import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/http.errors";
import { usersRepository } from "../repositories/users.repository";
import { UserResponse } from "../types/user";
import { bcryptHelper } from "../utils/hash";
import { mapToUserResponse } from "../utils/mappers/user-mapper";
import { DeleteUserDto } from "../validation/users/delete-user.schema";
import { UpdateUserDto } from "../validation/users/update-user.schema";

export const usersService = {
    async getProfile(id: number): Promise<UserResponse> {
        const user = await usersRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return mapToUserResponse(user);
    },

    async updateProfile(id: number, dto: UpdateUserDto): Promise<UserResponse> {
        if (dto.email) {
            const existing = await usersRepository.findByEmail(dto.email);
            if (existing && existing.id !== id) {
                throw new ConflictError("This email already exists");
            }
        }

        if (dto.username) {
            const existing = await usersRepository.findByUsername(dto.username);
            if (existing && existing.id !== id) {
                throw new ConflictError("This username already exists");
            }
        }

        const updatedUser = await usersRepository.update(id, dto);

        return mapToUserResponse(updatedUser);
    },

    async deleteAccount(id: number, dto: DeleteUserDto): Promise<void> {
        const user = await usersRepository.findById(id);

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

        const deletedUser = await usersRepository.delete(id);

        if (!deletedUser) {
            throw new NotFoundError("User not found during delete");
        }
    },
};
