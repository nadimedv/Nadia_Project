import { scheduleRepository } from "../repositories/schedule.repository.js";
import { ApiError } from "../errors/api-error.js";

export const scheduleService = {
    getAll() {
        return scheduleRepository.getAll();
    },

    getById(id: number) {
        const item = scheduleRepository.getById(id);
        if (!item) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }
        return item;
    },

    create(dto: any) {
        return scheduleRepository.create(dto);
    },

    update(id: number, dto: any) {
        const updated = scheduleRepository.update(id, dto);
        if (!updated) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }
        return updated;
    },

    delete(id: number) {
        const success = scheduleRepository.delete(id);
        if (!success) {
            throw new ApiError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
        }
    }
};