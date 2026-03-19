export interface Shift {
    id: number;
    date: string;
    timeSlot: string;
    userName: string;
    comment?: string;
    status: string;
}

export interface CreateShiftDto {
    date: string;
    timeSlot: string;
    userName: string;
    comment?: string;
    status: string;
}

export interface UpdateShiftDto {
    date?: string;
    timeSlot?: string;
    userName?: string;
    comment?: string;
    status?: string;
}
export interface ShiftQueryDto {
    status?: string;
    userName?: string;
    sortBy?: "date" | "timeSlot" | "userName" | "status";
    order?: "asc" | "desc";
    page?: string;
    pageSize?: string;
}