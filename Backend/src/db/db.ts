import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to open SQLite DB:", err.message);
        process.exit(1);
    }

    console.log("SQLite DB opened:", dbPath);
});

export function run(sql: string): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes
            });
        });
    });
}

export function get<T = unknown>(sql: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(row as T | undefined);
        });
    });
}

export function all<T = unknown>(sql: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows as T[]);
        });
    });
}