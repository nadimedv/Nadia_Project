import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../errors/api-error.js";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";

export const userService = {
    async getAll() {
        return await userRepository.getAll();
    },

    async getById(id: number) {
        const user = await userRepository.getById(id);

        if (!user) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }

        return user;
    },

    async create(dto: CreateUserDto) {
        const existing = await userRepository.findByEmail(dto.email);

        if (existing) {
            throw new ApiError(409, "USER_EMAIL_EXISTS", "User with this email already exists");
        }

        return await userRepository.create(dto);
    },

    async update(id: number, dto: UpdateUserDto) {
        const current = await userRepository.getById(id);

        if (!current) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }

        if (dto.email && dto.email !== current.email) {
            const existing = await userRepository.findByEmail(dto.email);

            if (existing) {
                throw new ApiError(409, "USER_EMAIL_EXISTS", "User with this email already exists");
            }
        }

        const updated = await userRepository.update(id, dto);

        if (!updated) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }

        return updated;
    },

    async delete(id: number) {
        const success = await userRepository.delete(id);

        if (!success) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }
    }
};