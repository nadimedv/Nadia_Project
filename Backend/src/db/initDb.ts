import { migrateDb } from "./migrate.js";

export async function initDb() {
    await migrateDb();
}