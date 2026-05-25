import type { Shift, CreateShiftDto, UpdateShiftDto, ShiftQueryDto } from "../dtos/shift.dto.js";
import { all, get, run } from "../db/db.js";

type ShiftStatusCount = {
    status: string;
    total: number;
};

const selectShiftSql = `
    SELECT id, date, timeSlot, userName, comment, status, ownerUserId
    FROM Shifts
`;

function normalizePagination(query: ShiftQueryDto): { limit: number; offset: number } | null {
    const page = query.page ? Number(query.page) : undefined;
    const pageSize = query.pageSize ? Number(query.pageSize) : undefined;

    if (!page || !pageSize || page <= 0 || pageSize <= 0) {
        return null;
    }

    const safePageSize = Math.min(pageSize, 50);
    return { limit: safePageSize, offset: (page - 1) * safePageSize };
}

export const shiftRepository = {
    async getAll(query: ShiftQueryDto, ownerUserId?: number): Promise<Shift[]> {
        const conditions: string[] = [];
        const params: unknown[] = [];

        if (ownerUserId) {
            conditions.push("ownerUserId = ?");
            params.push(ownerUserId);
        }

        if (query.status) {
            conditions.push("status = ?");
            params.push(query.status);
        }

        if (query.userName) {
            conditions.push("userName = ?");
            params.push(query.userName);
        }

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const allowedSortBy = new Set(["date", "timeSlot", "userName", "status"]);
        const sortBy = query.sortBy && allowedSortBy.has(query.sortBy) ? query.sortBy : "id";
        const order = query.order === "asc" ? "ASC" : "DESC";
        const pagination = normalizePagination(query);

        let paginationSql = "";
        if (pagination) {
            paginationSql = "LIMIT ? OFFSET ?";
            params.push(pagination.limit, pagination.offset);
        }

        return await all<Shift>(
            `${selectShiftSql}
             ${whereSql}
             ORDER BY ${sortBy} ${order}
             ${paginationSql};`,
            params
        );
    },

    async getById(id: number): Promise<Shift | undefined> {
        return await get<Shift>(
            `${selectShiftSql} WHERE id = ?;`,
            [id]
        );
    },

    async getByIdForOwner(id: number, ownerUserId: number): Promise<Shift | undefined> {
        return await get<Shift>(
            `${selectShiftSql} WHERE id = ? AND ownerUserId = ?;`,
            [id, ownerUserId]
        );
    },

    async getStatusCounts(ownerUserId?: number): Promise<ShiftStatusCount[]> {
        const params: unknown[] = [];
        const whereSql = ownerUserId ? "WHERE ownerUserId = ?" : "";
        if (ownerUserId) params.push(ownerUserId);

        return await all<ShiftStatusCount>(
            `SELECT status, COUNT(*) AS total
             FROM Shifts
             ${whereSql}
             GROUP BY status
             ORDER BY total DESC, status ASC;`,
            params
        );
    },

    async findDuplicate(date: string, timeSlot: string, userName: string, ownerUserId: number): Promise<Shift | undefined> {
        return await get<Shift>(
            `${selectShiftSql}
             WHERE date = ? AND timeSlot = ? AND userName = ? AND ownerUserId = ?;`,
            [date, timeSlot, userName, ownerUserId]
        );
    },

    async create(dto: CreateShiftDto, ownerUserId: number): Promise<Shift> {
        const result = await run(
            `INSERT INTO Shifts (date, timeSlot, userName, comment, status, ownerUserId)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [dto.date, dto.timeSlot, dto.userName, dto.comment || null, dto.status, ownerUserId]
        );

        const created = await this.getByIdForOwner(result.lastID, ownerUserId);

        if (!created) {
            throw new Error("Failed to fetch created shift");
        }

        return created;
    },

    async updateForOwner(id: number, ownerUserId: number, dto: UpdateShiftDto): Promise<Shift | null> {
        const current = await this.getByIdForOwner(id, ownerUserId);

        if (!current) {
            return null;
        }

        await run(
            `UPDATE Shifts
             SET date = ?, timeSlot = ?, userName = ?, comment = ?, status = ?
             WHERE id = ? AND ownerUserId = ?;`,
            [
                dto.date ?? current.date,
                dto.timeSlot ?? current.timeSlot,
                dto.userName ?? current.userName,
                dto.comment ?? current.comment ?? null,
                dto.status ?? current.status,
                id,
                ownerUserId
            ]
        );

        return await this.getByIdForOwner(id, ownerUserId) ?? null;
    },

    async update(id: number, dto: UpdateShiftDto): Promise<Shift | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        await run(
            `UPDATE Shifts
             SET date = ?, timeSlot = ?, userName = ?, comment = ?, status = ?, ownerUserId = ?
             WHERE id = ?;`,
            [
                dto.date ?? current.date,
                dto.timeSlot ?? current.timeSlot,
                dto.userName ?? current.userName,
                dto.comment ?? current.comment ?? null,
                dto.status ?? current.status,
                current.ownerUserId,
                id
            ]
        );

        return await this.getById(id) ?? null;
    },

    async deleteForOwner(id: number, ownerUserId: number): Promise<boolean> {
        const result = await run(
            `DELETE FROM Shifts WHERE id = ? AND ownerUserId = ?;`,
            [id, ownerUserId]
        );

        return result.changes > 0;
    }
};
