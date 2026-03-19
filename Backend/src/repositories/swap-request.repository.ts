import { SwapRequest, CreateSwapRequestDto, UpdateSwapRequestDto } from "../dtos/swap-request.dto.js";

let items: SwapRequest[] = [];
let nextId = 1;

export const swapRequestRepository = {
    getAll(): SwapRequest[] {
        return items;
    },

    getById(id: number): SwapRequest | undefined {
        return items.find(i => i.id === id);
    },

    create(dto: CreateSwapRequestDto): SwapRequest {
        const newItem: SwapRequest = {
            id: nextId++,
            ...dto
        };

        items.push(newItem);
        return newItem;
    },

    update(id: number, dto: UpdateSwapRequestDto): SwapRequest | null {
        const item = items.find(i => i.id === id);
        if (!item) return null;

        Object.assign(item, dto);
        return item;
    },

    delete(id: number): boolean {
        const index = items.findIndex(i => i.id === id);
        if (index === -1) return false;

        items.splice(index, 1);
        return true;
    }
};