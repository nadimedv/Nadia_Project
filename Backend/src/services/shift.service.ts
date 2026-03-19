import { shiftRepository } from "../repositories/shift.repository.js";
import { ApiError } from "../errors/api-error.js";
import type { CreateShiftDto, ShiftQueryDto, UpdateShiftDto } from "../dtos/shift.dto.js";

export const shiftService = {
    getAll(query: ShiftQueryDto) {
        return shiftRepository.getAll(query);
    },

    getById(id: number) {
        const shift = shiftRepository.getById(id);
        if (!shift) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }
        return shift;
    },

    create(dto: CreateShiftDto) {
        return shiftRepository.create(dto);
    },

    update(id: number, dto: UpdateShiftDto) {
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