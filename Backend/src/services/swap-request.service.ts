import { swapRequestRepository } from "../repositories/swap-request.repository.js";
import { shiftRepository } from "../repositories/shift.repository.js";
import { ApiError } from "../errors/api-error.js";
import type {
    CreateSwapRequestDto,
    UpdateSwapRequestDto
} from "../dtos/swap-request.dto.js";

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

    create(dto: CreateSwapRequestDto) {
        const shift = shiftRepository.getById(dto.shiftId);
        if (!shift) {
            throw new ApiError(400, "SHIFT_NOT_FOUND_FOR_SWAP", "Referenced shift does not exist");
        }

        return swapRequestRepository.create(dto);
    },

    update(id: number, dto: UpdateSwapRequestDto) {
        const current = swapRequestRepository.getById(id);
        if (!current) {
            throw new ApiError(404, "SWAP_NOT_FOUND", "Swap request not found");
        }

        const shiftId = dto.shiftId ?? current.shiftId;
        const shift = shiftRepository.getById(shiftId);
        if (!shift) {
            throw new ApiError(400, "SHIFT_NOT_FOUND_FOR_SWAP", "Referenced shift does not exist");
        }

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