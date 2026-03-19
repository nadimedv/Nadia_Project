import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../errors/api-error.js";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";

export const userService = {
    getAll() {
        return userRepository.getAll();
    },

    getById(id: number) {
        const user = userRepository.getById(id);
        if (!user) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }
        return user;
    },

    create(dto: CreateUserDto) {
        const existing = userRepository.findByEmail(dto.email);
        if (existing) {
            throw new ApiError(409, "USER_EMAIL_EXISTS", "User with this email already exists");
        }

        return userRepository.create(dto);
    },

    update(id: number, dto: UpdateUserDto) {
        const current = userRepository.getById(id);
        if (!current) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }

        if (dto.email && dto.email !== current.email) {
            const existing = userRepository.findByEmail(dto.email);
            if (existing) {
                throw new ApiError(409, "USER_EMAIL_EXISTS", "User with this email already exists");
            }
        }

        const updated = userRepository.update(id, dto);
        if (!updated) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }

        return updated;
    },

    delete(id: number) {
        const success = userRepository.delete(id);
        if (!success) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }
    }
};