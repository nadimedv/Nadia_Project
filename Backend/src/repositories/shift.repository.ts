import type { Shift, CreateShiftDto, UpdateShiftDto, ShiftQueryDto } from "../dtos/shift.dto.js";

let shifts: Shift[] = [];
let nextId = 1;

export const shiftRepository = {
    getAll(query: ShiftQueryDto): Shift[] {
        let result = [...shifts];

        if (query.status) {
            result = result.filter((s) => s.status === query.status);
        }

        if (query.userName) {
            result = result.filter((s) => s.userName === query.userName);
        }

        if (query.sortBy) {
            result.sort((a, b) => {
                const aValue = a[query.sortBy!];
                const bValue = b[query.sortBy!];

                if (aValue === bValue) return 0;

                if (query.order === "desc") {
                    return aValue < bValue ? 1 : -1;
                }

                return aValue > bValue ? 1 : -1;
            });
        }

        const page = query.page ? Number(query.page) : undefined;
        const pageSize = query.pageSize ? Number(query.pageSize) : undefined;

        if (page && pageSize && page > 0 && pageSize > 0) {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            result = result.slice(start, end);
        }

        return result;
    },

    getById(id: number): Shift | undefined {
        return shifts.find(s => s.id === id);
    },
    findDuplicate(date: string, timeSlot: string, userName: string): Shift | undefined {
        return shifts.find(
            (s) => s.date === date && s.timeSlot === timeSlot && s.userName === userName
        );
    },

    create(dto: CreateShiftDto): Shift {
        const newShift: Shift = {
            id: nextId++,
            ...dto
        };

        shifts.push(newShift);
        return newShift;
    },

    update(id: number, dto: UpdateShiftDto): Shift | null {
        const shift = shifts.find(s => s.id === id);
        if (!shift) return null;

        Object.assign(shift, dto);
        return shift;
    },

    delete(id: number): boolean {
        const index = shifts.findIndex(s => s.id === id);
        if (index === -1) return false;

        shifts.splice(index, 1);
        return true;
    }
};