import { Schedule, CreateScheduleDto, UpdateScheduleDto } from "../dtos/schedule.dto.js";

let schedules: Schedule[] = [];
let nextId = 1;

export const scheduleRepository = {
    getAll(): Schedule[] {
        return schedules;
    },

    getById(id: number): Schedule | undefined {
        return schedules.find(s => s.id === id);
    },

    create(dto: CreateScheduleDto): Schedule {
        const newItem: Schedule = {
            id: nextId++,
            ...dto
        };

        schedules.push(newItem);
        return newItem;
    },

    update(id: number, dto: UpdateScheduleDto): Schedule | null {
        const item = schedules.find(s => s.id === id);
        if (!item) return null;

        Object.assign(item, dto);
        return item;
    },

    delete(id: number): boolean {
        const index = schedules.findIndex(s => s.id === id);
        if (index === -1) return false;

        schedules.splice(index, 1);
        return true;
    }
};