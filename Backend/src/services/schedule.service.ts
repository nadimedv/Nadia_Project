import { scheduleRepository } from "../repositories/schedule.repository.js";
import { shiftRepository } from "../repositories/shift.repository.js";
import { ApiError } from "../errors/api-error.js";
import type { CreateScheduleDto, UpdateScheduleDto } from "../dtos/schedule.dto.js";

export const scheduleService = {
    async getAll() {
        return await scheduleRepository.getAll();
    },

    async getById(id: number) {
        const item = await scheduleRepository.getById(id);

        if (!item) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }

        return item;
    },

    async getWithShifts(query: Record<string, string | undefined>) {
        return await scheduleRepository.getWithShifts(query);
    },

    async create(dto: CreateScheduleDto) {
        const shift = await shiftRepository.getById(Number(dto.shiftId));

        if (!shift) {
            throw new ApiError(400, "SCHEDULE_SHIFT_INVALID", "Referenced shift does not exist");
        }

        return await scheduleRepository.create(dto);
    },

    async update(id: number, dto: UpdateScheduleDto) {
        const current = await scheduleRepository.getById(id);

        if (!current) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }

        const nextShiftId = Number(dto.shiftId ?? current.shiftId);
        const shift = await shiftRepository.getById(nextShiftId);

        if (!shift) {
            throw new ApiError(400, "SCHEDULE_SHIFT_INVALID", "Referenced shift does not exist");
        }

        const updated = await scheduleRepository.update(id, dto);

        if (!updated) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }

        return updated;
    },

    async delete(id: number) {
        const success = await scheduleRepository.delete(id);

        if (!success) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }
    }
};