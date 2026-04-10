import { run } from "../db/db.js";
import { ApiError } from "../errors/api-error.js";
import { shiftRepository } from "../repositories/shift.repository.js";
import { swapRequestRepository } from "../repositories/swap-request.repository.js";
import type {
    CreateSwapRequestDto,
    UpdateSwapRequestDto
} from "../dtos/swap-request.dto.js";

export const swapRequestService = {
    async getAll() {
        return await swapRequestRepository.getAll();
    },

    async getById(id: number) {
        const item = await swapRequestRepository.getById(id);

        if (!item) {
            throw new ApiError(404, "SWAP_REQUEST_NOT_FOUND", "Swap request not found");
        }

        return item;
    },

    async create(dto: CreateSwapRequestDto) {
        const shift = await shiftRepository.getById(Number(dto.shiftId));

        if (!shift) {
            throw new ApiError(400, "SWAP_REQUEST_SHIFT_INVALID", "Referenced shift does not exist");
        }

        return await swapRequestRepository.create(dto);
    },

    async update(id: number, dto: UpdateSwapRequestDto) {
        const current = await swapRequestRepository.getById(id);

        if (!current) {
            throw new ApiError(404, "SWAP_REQUEST_NOT_FOUND", "Swap request not found");
        }

        const nextShiftId = Number(dto.shiftId ?? current.shiftId);
        const shift = await shiftRepository.getById(nextShiftId);

        if (!shift) {
            throw new ApiError(400, "SWAP_REQUEST_SHIFT_INVALID", "Referenced shift does not exist");
        }

        const updated = await swapRequestRepository.update(id, dto);

        if (!updated) {
            throw new ApiError(404, "SWAP_REQUEST_NOT_FOUND", "Swap request not found");
        }

        return updated;
    },

    async delete(id: number) {
        const success = await swapRequestRepository.delete(id);

        if (!success) {
            throw new ApiError(404, "SWAP_REQUEST_NOT_FOUND", "Swap request not found");
        }
    },

    async approve(id: number) {
        const request = await swapRequestRepository.getById(id);

        if (!request) {
            throw new ApiError(404, "SWAP_REQUEST_NOT_FOUND", "Swap request not found");
        }

        if (request.status !== "pending") {
            throw new ApiError(400, "SWAP_REQUEST_NOT_PENDING", "Only pending swap request can be approved");
        }

        const shift = await shiftRepository.getById(Number(request.shiftId));

        if (!shift) {
            throw new ApiError(400, "SWAP_REQUEST_SHIFT_INVALID", "Referenced shift does not exist");
        }

        await run("BEGIN TRANSACTION;");

        try {
            const approvedRequest = await swapRequestRepository.updateStatus(id, "approved");

            const updatedShift = await shiftRepository.update(Number(request.shiftId), {
                userName: request.targetUser,
                comment: `Swap approved: ${request.requestedBy} -> ${request.targetUser}`
            });

            await run("COMMIT;");

            return {
                swapRequest: approvedRequest,
                shift: updatedShift
            };
        } catch (error) {
            await run("ROLLBACK;");
            throw error;
        }
    }
};