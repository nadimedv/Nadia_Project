import { Shift, CreateShiftDto, UpdateShiftDto } from "../dtos/shift.dto.js";

let shifts: Shift[] = [];
let nextId = 1;

export const shiftRepository = {
    getAll(query: any): Shift[] {
        let result = [...shifts];

        // 🔍 ФІЛЬТР
        if (query.status) {
            result = result.filter(s => s.status === query.status);
        }

        if (query.userName) {
            result = result.filter(s => s.userName === query.userName);
        }

        // 🔽 СОРТУВАННЯ
        if (query.sortBy) {
            result.sort((a, b) => {
                if (query.order === "desc") {
                    return a[query.sortBy] < b[query.sortBy] ? 1 : -1;
                }
                return a[query.sortBy] > b[query.sortBy] ? 1 : -1;
            });
        }

        return result;
    } ,

    getById(id: number): Shift | undefined {
        return shifts.find(s => s.id === id);
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