import type { Shift, CreateShiftDto, UpdateShiftDto, ShiftQueryDto } from "../dtos/shift.dto.js";
import { all, get, run } from "../db/db.js";

type ShiftStatusCount = {
    status: string;
    total: number;
};

function escapeSqlString(value: string): string {
    return value.replace(/'/g, "''");
}

export const shiftRepository = {
    async getAll(query: ShiftQueryDto): Promise<Shift[]> {
        const conditions: string[] = [];

        if (query.status) {
            conditions.push(`status = '${escapeSqlString(query.status)}'`);
        }

        if (query.userName) {
            conditions.push(`userName = '${escapeSqlString(query.userName)}'`);
        }

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const allowedSortBy = ["date", "timeSlot", "userName", "status"];
        const sortBy = query.sortBy && allowedSortBy.includes(query.sortBy)
            ? query.sortBy
            : "id";

        const order = query.order === "asc" ? "ASC" : "DESC";

        let paginationSql = "";
        const page = query.page ? Number(query.page) : undefined;
        const pageSize = query.pageSize ? Number(query.pageSize) : undefined;

        if (page && pageSize && page > 0 && pageSize > 0) {
            const offset = (page - 1) * pageSize;
            paginationSql = `LIMIT ${pageSize} OFFSET ${offset}`;
        }

        return await all<Shift>(`
            SELECT id, date, timeSlot, userName, comment, status
            FROM Shifts
                ${whereSql}
            ORDER BY ${sortBy} ${order}
                     ${paginationSql};
        `);
    },

    async getById(id: number): Promise<Shift | undefined> {
        return await get<Shift>(`
            SELECT id, date, timeSlot, userName, comment, status
            FROM Shifts
            WHERE id = ${Number(id)};
        `);
    },

    async getStatusCounts(): Promise<ShiftStatusCount[]> {
        return await all<ShiftStatusCount>(`
            SELECT
                status,
                COUNT(*) AS total
            FROM Shifts
            GROUP BY status
            ORDER BY total DESC, status ASC;
        `);
    },

    async findDuplicate(date: string, timeSlot: string, userName: string): Promise<Shift | undefined> {
        const safeDate = escapeSqlString(date);
        const safeTimeSlot = escapeSqlString(timeSlot);
        const safeUserName = escapeSqlString(userName);

        return await get<Shift>(`
            SELECT id, date, timeSlot, userName, comment, status
            FROM Shifts
            WHERE date = '${safeDate}'
              AND timeSlot = '${safeTimeSlot}'
              AND userName = '${safeUserName}';
        `);
    },

    async create(dto: CreateShiftDto): Promise<Shift> {
        const safeDate = escapeSqlString(dto.date);
        const safeTimeSlot = escapeSqlString(dto.timeSlot);
        const safeUserName = escapeSqlString(dto.userName);
        const safeComment = dto.comment ? escapeSqlString(dto.comment) : null;
        const safeStatus = escapeSqlString(dto.status);

        const result = await run(`
            INSERT INTO Shifts (date, timeSlot, userName, comment, status)
            VALUES (
                           '${safeDate}',
                           '${safeTimeSlot}',
                           '${safeUserName}',
                           ${safeComment !== null ? `'${safeComment}'` : "NULL"},
                           '${safeStatus}'
                   );
        `);

        const created = await get<Shift>(`
            SELECT id, date, timeSlot, userName, comment, status
            FROM Shifts
            WHERE id = ${result.lastID};
        `);

        if (!created) {
            throw new Error("Failed to fetch created shift");
        }

        return created;
    },

    async update(id: number, dto: UpdateShiftDto): Promise<Shift | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        const nextDate = escapeSqlString(dto.date ?? current.date);
        const nextTimeSlot = escapeSqlString(dto.timeSlot ?? current.timeSlot);
        const nextUserName = escapeSqlString(dto.userName ?? current.userName);
        const nextCommentRaw = dto.comment ?? current.comment ?? null;
        const nextComment = nextCommentRaw !== null ? escapeSqlString(nextCommentRaw) : null;
        const nextStatus = escapeSqlString(dto.status ?? current.status);

        await run(`
            UPDATE Shifts
            SET
                date = '${nextDate}',
                timeSlot = '${nextTimeSlot}',
                userName = '${nextUserName}',
                comment = ${nextComment !== null ? `'${nextComment}'` : "NULL"},
                status = '${nextStatus}'
            WHERE id = ${Number(id)};
        `);

        const updated = await this.getById(id);
        return updated ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM Shifts
            WHERE id = ${Number(id)};
        `);

        return result.changes > 0;
    }
};