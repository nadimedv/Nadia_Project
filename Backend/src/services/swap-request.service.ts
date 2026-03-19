import { swapRequestRepository } from "../repositories/swap-request.repository.js";
import { ApiError } from "../errors/api-error.js";

export const swapRequestService = {
    getAll() {
        return swapRequestRepository.getAll();
    },

    getById(id: number) {
        const item = swapRequestRepository.getById(id);
        if (!item) {
            throw new ApiError(404, "SWAP_NOT_FOUND", "Swap request not found");
        }
        return item;
    },

    create(dto: any) {
        return swapRequestRepository.create(dto);
    },

    update(id: number, dto: any) {
        const updated = swapRequestRepository.update(id, dto);
        if (!updated) {
            throw new ApiError(404, "SWAP_NOT_FOUND", "Swap request not found");
        }
        return updated;
    },

    delete(id: number) {
        const success = swapRequestRepository.delete(id);
        if (!success) {
            throw new ApiError(404, "SWAP_NOT_FOUND", "Swap request not found");
        }
    }
};