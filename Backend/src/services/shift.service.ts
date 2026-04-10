import { shiftRepository } from "../repositories/shift.repository.js";
import { ApiError } from "../errors/api-error.js";
import type { CreateShiftDto, ShiftQueryDto, UpdateShiftDto } from "../dtos/shift.dto.js";

export const shiftService = {
    async getAll(query: ShiftQueryDto) {
        return await shiftRepository.getAll(query);
    },

    async getById(id: number) {
        const shift = await shiftRepository.getById(id);

        if (!shift) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        return shift;
    },

    async getStatusCounts() {
        return await shiftRepository.getStatusCounts();
    },

    async create(dto: CreateShiftDto) {
        const duplicate = await shiftRepository.findDuplicate(dto.date, dto.timeSlot, dto.userName);

        if (duplicate) {
            throw new ApiError(
                409,
                "SHIFT_ALREADY_EXISTS",
                "Shift with the same date, time slot and user already exists"
            );
        }

        return await shiftRepository.create(dto);
    },

    async update(id: number, dto: UpdateShiftDto) {
        const current = await shiftRepository.getById(id);

        if (!current) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        const date = dto.date ?? current.date;
        const timeSlot = dto.timeSlot ?? current.timeSlot;
        const userName = dto.userName ?? current.userName;

        const duplicate = await shiftRepository.findDuplicate(date, timeSlot, userName);

        if (duplicate && duplicate.id !== id) {
            throw new ApiError(
                409,
                "SHIFT_ALREADY_EXISTS",
                "Shift with the same date, time slot and user already exists"
            );
        }

        const updated = await shiftRepository.update(id, dto);

        if (!updated) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        return updated;
    },

    async delete(id: number) {
        const success = await shiftRepository.delete(id);

        if (!success) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }
    }
};