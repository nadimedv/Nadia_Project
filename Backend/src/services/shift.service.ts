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
        const duplicate = shiftRepository.findDuplicate(dto.date, dto.timeSlot, dto.userName);
        if (duplicate) {
            throw new ApiError(
                409,
                "SHIFT_ALREADY_EXISTS",
                "Shift with the same date, time slot and user already exists"
            );
        }

        return shiftRepository.create(dto);
    },

    update(id: number, dto: UpdateShiftDto) {
        const current = shiftRepository.getById(id);
        if (!current) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        const date = dto.date ?? current.date;
        const timeSlot = dto.timeSlot ?? current.timeSlot;
        const userName = dto.userName ?? current.userName;

        const duplicate = shiftRepository.findDuplicate(date, timeSlot, userName);
        if (duplicate && duplicate.id !== id) {
            throw new ApiError(
                409,
                "SHIFT_ALREADY_EXISTS",
                "Shift with the same date, time slot and user already exists"
            );
        }

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