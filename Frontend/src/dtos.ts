export type ShiftStatus = "planned" | "done" | "canceled";

export type TimeSlot =
    | "08:00-10:00"
    | "10:00-12:00"
    | "12:00-14:00"
    | "14:00-16:00"
    | "16:00-18:00";

export interface ShiftDto {
    id: number;
    date: string;
    timeSlot: TimeSlot | string;
    userName: string;
    comment?: string | null;
    status: ShiftStatus | string;
}

export interface CreateShiftDto {
    date: string;
    timeSlot: TimeSlot;
    userName: string;
    comment?: string;
    status: ShiftStatus;
}

export type UpdateShiftDto = Partial<CreateShiftDto>;

export interface ListResponse<T> {
    items: T[];
}

export interface ItemResponse<T> {
    item: T;
}

export interface FieldError {
    field: string;
    message: string;
}

export interface ApiError {
    status: number;
    code?: string;
    message: string;
    detail?: unknown;
    details?: unknown;
    errors?: FieldError[] | Record<string, string[]>;
}
