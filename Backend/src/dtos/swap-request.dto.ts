export interface SwapRequest {
    id: number;
    shiftId: number;
    requestedBy: string;
    targetUser: string;
    status: string;
}

export interface CreateSwapRequestDto {
    shiftId: number;
    requestedBy: string;
    targetUser: string;
    status: string;
}

export interface UpdateSwapRequestDto {
    shiftId?: number;
    requestedBy?: string;
    targetUser?: string;
    status?: string;
}