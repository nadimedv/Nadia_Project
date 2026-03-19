export interface Schedule {
    id: number;
    date: string;
    shiftId: number;
    note?: string;
}

export interface CreateScheduleDto {
    date: string;
    shiftId: number;
    note?: string;
}

export interface UpdateScheduleDto {
    date?: string;
    shiftId?: number;
    note?: string;
}