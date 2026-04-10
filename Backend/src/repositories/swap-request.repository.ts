import type {
    SwapRequest,
    CreateSwapRequestDto,
    UpdateSwapRequestDto
} from "../dtos/swap-request.dto.js";
import { all, get, run } from "../db/db.js";

function escapeSqlString(value: string): string {
    return value.replace(/'/g, "''");
}

export const swapRequestRepository = {
    async getAll(): Promise<SwapRequest[]> {
        return await all<SwapRequest>(`
            SELECT id, shiftId, requestedBy, targetUser, status
            FROM SwapRequests
            ORDER BY id DESC;
        `);
    },

    async getById(id: number): Promise<SwapRequest | undefined> {
        return await get<SwapRequest>(`
            SELECT id, shiftId, requestedBy, targetUser, status
            FROM SwapRequests
            WHERE id = ${Number(id)};
        `);
    },

    async create(dto: CreateSwapRequestDto): Promise<SwapRequest> {
        const shiftId = Number(dto.shiftId);
        const safeRequestedBy = escapeSqlString(dto.requestedBy);
        const safeTargetUser = escapeSqlString(dto.targetUser);
        const safeStatus = escapeSqlString(dto.status);

        const result = await run(`
            INSERT INTO SwapRequests (shiftId, requestedBy, targetUser, status)
            VALUES (${shiftId}, '${safeRequestedBy}', '${safeTargetUser}', '${safeStatus}');
        `);

        const created = await this.getById(result.lastID);

        if (!created) {
            throw new Error("Failed to fetch created swap request");
        }

        return created;
    },

    async update(id: number, dto: UpdateSwapRequestDto): Promise<SwapRequest | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        const nextShiftId = Number(dto.shiftId ?? current.shiftId);
        const nextRequestedBy = escapeSqlString(dto.requestedBy ?? current.requestedBy);
        const nextTargetUser = escapeSqlString(dto.targetUser ?? current.targetUser);
        const nextStatus = escapeSqlString(dto.status ?? current.status);

        await run(`
            UPDATE SwapRequests
            SET
                shiftId = ${nextShiftId},
                requestedBy = '${nextRequestedBy}',
                targetUser = '${nextTargetUser}',
                status = '${nextStatus}'
            WHERE id = ${Number(id)};
        `);

        const updated = await this.getById(id);
        return updated ?? null;
    },

    async updateStatus(id: number, status: string): Promise<SwapRequest | null> {
        const safeStatus = escapeSqlString(status);

        await run(`
            UPDATE SwapRequests
            SET status = '${safeStatus}'
            WHERE id = ${Number(id)};
        `);

        const updated = await this.getById(id);
        return updated ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM SwapRequests
            WHERE id = ${Number(id)};
        `);

        return result.changes > 0;
    }
};