import type { User, CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { all, get, run } from "../db/db.js";

function escapeSqlString(value: string): string {
    return value.replace(/'/g, "''");
}

export const userRepository = {
    async getAll(): Promise<User[]> {
        return await all<User>(`
            SELECT id, name, email
            FROM Users
            ORDER BY id DESC;
        `);
    },

    async getById(id: number): Promise<User | undefined> {
        return await get<User>(`
            SELECT id, name, email
            FROM Users
            WHERE id = ${Number(id)};
        `);
    },

    async findByEmail(email: string): Promise<User | undefined> {
        const safeEmail = escapeSqlString(email);

        return await get<User>(`
            SELECT id, name, email
            FROM Users
            WHERE email = '${safeEmail}';
        `);
    },

    async create(dto: CreateUserDto): Promise<User> {
        const safeName = escapeSqlString(dto.name);
        const safeEmail = escapeSqlString(dto.email);

        const result = await run(`
            INSERT INTO Users (name, email)
            VALUES ('${safeName}', '${safeEmail}');
        `);

        const created = await get<User>(`
            SELECT id, name, email
            FROM Users
            WHERE id = ${result.lastID};
        `);

        if (!created) {
            throw new Error("Failed to fetch created user");
        }

        return created;
    },

    async update(id: number, dto: UpdateUserDto): Promise<User | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        const nextName = escapeSqlString(dto.name ?? current.name);
        const nextEmail = escapeSqlString(dto.email ?? current.email);

        await run(`
            UPDATE Users
            SET name = '${nextName}', email = '${nextEmail}'
            WHERE id = ${Number(id)};
        `);

        const updated = await this.getById(id);
        return updated ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM Users
            WHERE id = ${Number(id)};
        `);

        return result.changes > 0;
    }
};