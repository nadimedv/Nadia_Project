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