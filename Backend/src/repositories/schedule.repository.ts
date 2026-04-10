import type { Schedule, CreateScheduleDto, UpdateScheduleDto } from "../dtos/schedule.dto.js";
import { all, get, run } from "../db/db.js";

type ScheduleWithShift = {
    scheduleId: number;
    scheduleDate: string;
    note: string | null;
    shiftId: number;
    shiftDate: string;
    timeSlot: string;
    userName: string;
    comment: string | null;
    status: string;
};

type ScheduleWithShiftQuery = {
    status?: string;
    userName?: string;
    sortBy?: string;
    order?: string;
};

function escapeSqlString(value: string): string {
    return value.replace(/'/g, "''");
}

export const scheduleRepository = {
    async getAll(): Promise<Schedule[]> {
        return await all<Schedule>(`
            SELECT id, date, shiftId, note
            FROM Schedule
            ORDER BY id DESC;
        `);
    },

    async getById(id: number): Promise<Schedule | undefined> {
        return await get<Schedule>(`
            SELECT id, date, shiftId, note
            FROM Schedule
            WHERE id = ${Number(id)};
        `);
    },

    async getWithShifts(query: ScheduleWithShiftQuery = {}): Promise<ScheduleWithShift[]> {
        const conditions: string[] = [];

        if (query.status) {
            conditions.push(`sh.status = '${escapeSqlString(query.status)}'`);
        }

        if (query.userName) {
            conditions.push(`sh.userName = '${escapeSqlString(query.userName)}'`);
        }

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const allowedSortMap: Record<string, string> = {
            scheduleDate: "s.date",
            shiftDate: "sh.date",
            timeSlot: "sh.timeSlot",
            userName: "sh.userName",
            status: "sh.status"
        };

        const sortColumn = query.sortBy && allowedSortMap[query.sortBy]
            ? allowedSortMap[query.sortBy]
            : "s.date";

        const order = query.order === "asc" ? "ASC" : "DESC";

        return await all<ScheduleWithShift>(`
            SELECT
                s.id AS scheduleId,
                s.date AS scheduleDate,
                s.note AS note,
                sh.id AS shiftId,
                sh.date AS shiftDate,
                sh.timeSlot AS timeSlot,
                sh.userName AS userName,
                sh.comment AS comment,
                sh.status AS status
            FROM Schedule s
                     JOIN Shifts sh ON s.shiftId = sh.id
                ${whereSql}
            ORDER BY ${sortColumn} ${order}, s.id DESC;
        `);
    },

    async create(dto: CreateScheduleDto): Promise<Schedule> {
        const safeDate = escapeSqlString(dto.date);
        const safeNote = dto.note ? escapeSqlString(dto.note) : null;
        const shiftId = Number(dto.shiftId);

        const result = await run(`
            INSERT INTO Schedule (date, shiftId, note)
            VALUES (
                           '${safeDate}',
                           ${shiftId},
                           ${safeNote !== null ? `'${safeNote}'` : "NULL"}
                   );
        `);

        const created = await get<Schedule>(`
            SELECT id, date, shiftId, note
            FROM Schedule
            WHERE id = ${result.lastID};
        `);

        if (!created) {
            throw new Error("Failed to fetch created schedule");
        }

        return created;
    },

    async update(id: number, dto: UpdateScheduleDto): Promise<Schedule | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        const nextDate = escapeSqlString(dto.date ?? current.date);
        const nextShiftId = Number(dto.shiftId ?? current.shiftId);
        const nextNoteRaw = dto.note ?? current.note ?? null;
        const nextNote = nextNoteRaw !== null ? escapeSqlString(nextNoteRaw) : null;

        await run(`
            UPDATE Schedule
            SET
                date = '${nextDate}',
                shiftId = ${nextShiftId},
                note = ${nextNote !== null ? `'${nextNote}'` : "NULL"}
            WHERE id = ${Number(id)};
        `);

        const updated = await this.getById(id);
        return updated ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM Schedule
            WHERE id = ${Number(id)};
        `);

        return result.changes > 0;
    }
};