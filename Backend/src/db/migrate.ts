import fs from "fs";
import path from "path";
import { all, run } from "./db.js";

type MigrationRow = {
    filename: string;
};

function escapeSqlString(value: string): string {
    return value.replace(/'/g, "''");
}

export async function migrateDb(): Promise<void> {
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            filename TEXT NOT NULL UNIQUE,
            appliedAt TEXT NOT NULL
        );
    `);

    const migrationsDir = path.join(process.cwd(), "src", "migrations");

    const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => /^\d+_.+\.sql$/.test(file))
        .sort();
    console.log("Migrations dir:", migrationsDir);
    console.log("Migration files found:", files);
    const applied = await all<MigrationRow>(`
        SELECT filename
        FROM schema_migrations;
    `);

    const appliedSet = new Set(applied.map((row) => row.filename));

    for (const file of files) {
        if (appliedSet.has(file)) {
            continue;
        }

        const fullPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(fullPath, "utf8").trim();

        if (!sql) {
            continue;
        }

        await run(sql);

        const now = new Date().toISOString();

        await run(`
            INSERT INTO schema_migrations (filename, appliedAt)
            VALUES ('${escapeSqlString(file)}', '${now}');
        `);

        console.log(`Migration applied: ${file}`);
    }

    console.log("DB migrations checked");
}

if (process.argv[1]?.includes("migrate.ts")) {
    migrateDb().catch((err) => {
        console.error("Migration error:", err);
        process.exit(1);
    });
}