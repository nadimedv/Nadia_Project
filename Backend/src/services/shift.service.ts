import { shiftRepository } from "../repositories/shift.repository.js";
import { ApiError } from "../errors/api-error.js";

export const shiftService = {
    getAll() {
        return shiftRepository.getAll();
    },

    getById(id: number) {
        const shift = shiftRepository.getById(id);
        if (!shift) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }
        return shift;
    },

    create(dto: any) {
        return shiftRepository.create(dto);
    },

    update(id: number, dto: any) {
        const updated = shiftRepository.update(id, dto);
        if (!updated) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }
        return updated;
    },

    delete(id: number) {
        const success = shiftRepository.delete(id);
        if (!success) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }
    }
};