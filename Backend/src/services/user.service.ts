import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../errors/api-error.js";

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

    create(dto: any) {
        return userRepository.create(dto);
    },

    update(id: number, dto: any) {
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