import { shiftRepository } from "../repositories/shift.repository.js";
import { ApiError } from "../errors/api-error.js";
import type { CreateShiftDto, ShiftQueryDto, UpdateShiftDto } from "../dtos/shift.dto.js";

function assertValidId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError(400, "INVALID_ID", "Id must be a positive integer");
    }
}

export const shiftService = {
    async getAll(query: ShiftQueryDto, currentUserId: number) {
        return await shiftRepository.getAll(query, currentUserId);
    },

    async getById(id: number, currentUserId: number) {
        assertValidId(id);
        const shift = await shiftRepository.getByIdForOwner(id, currentUserId);

        if (!shift) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        return shift;
    },

    async getStatusCounts(currentUserId: number) {
        return await shiftRepository.getStatusCounts(currentUserId);
    },

    async create(dto: CreateShiftDto, currentUserId: number) {
        const duplicate = await shiftRepository.findDuplicate(dto.date, dto.timeSlot, dto.userName, currentUserId);

        if (duplicate) {
            throw new ApiError(409, "SHIFT_ALREADY_EXISTS", "Shift with the same date, time slot and user already exists");
        }

        return await shiftRepository.create(dto, currentUserId);
    },

    async update(id: number, dto: UpdateShiftDto, currentUserId: number) {
        assertValidId(id);
        const current = await shiftRepository.getByIdForOwner(id, currentUserId);

        if (!current) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        const date = dto.date ?? current.date;
        const timeSlot = dto.timeSlot ?? current.timeSlot;
        const userName = dto.userName ?? current.userName;
        const duplicate = await shiftRepository.findDuplicate(date, timeSlot, userName, currentUserId);

        if (duplicate && duplicate.id !== id) {
            throw new ApiError(409, "SHIFT_ALREADY_EXISTS", "Shift with the same date, time slot and user already exists");
        }

        const updated = await shiftRepository.updateForOwner(id, currentUserId, dto);

        if (!updated) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }

        return updated;
    },

    async delete(id: number, currentUserId: number) {
        assertValidId(id);
        const success = await shiftRepository.deleteForOwner(id, currentUserId);

        if (!success) {
            throw new ApiError(404, "SHIFT_NOT_FOUND", "Shift not found");
        }
    }
};
