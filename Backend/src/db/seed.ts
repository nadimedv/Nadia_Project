import { initDb } from "./initDb.js";
import { run } from "./db.js";

export async function seedDb() {
    await initDb();

    console.log("Seeding database...");

    await run(`DELETE FROM Schedule;`);
    await run(`DELETE FROM SwapRequests;`);
    await run(`DELETE FROM Shifts;`);
    await run(`DELETE FROM Users;`);

    await run(`
        INSERT INTO Users (name, email)
        VALUES ('Nadia', 'nadia@example.com');
    `);

    await run(`
        INSERT INTO Users (name, email)
        VALUES ('Olena', 'olena@example.com');
    `);

    await run(`
        INSERT INTO Users (name, email)
        VALUES ('Maksym', 'maksym@example.com');
    `);

    await run(`
        INSERT INTO Shifts (date, timeSlot, userName, comment, status)
        VALUES ('2026-04-20', '08:00-10:00', 'Nadia', 'Morning duty', 'planned');
    `);

    await run(`
        INSERT INTO Shifts (date, timeSlot, userName, comment, status)
        VALUES ('2026-04-20', '10:00-12:00', 'Olena', 'Lab support', 'done');
    `);

    await run(`
        INSERT INTO Shifts (date, timeSlot, userName, comment, status)
        VALUES ('2026-04-21', '12:00-14:00', 'Maksym', 'Equipment check', 'planned');
    `);

    await run(`
        INSERT INTO Schedule (date, shiftId, note)
        VALUES ('2026-04-20', 1, 'Main day schedule');
    `);

    await run(`
        INSERT INTO Schedule (date, shiftId, note)
        VALUES ('2026-04-21', 3, 'Second day schedule');
    `);

    await run(`
        INSERT INTO SwapRequests (shiftId, requestedBy, targetUser, status)
        VALUES (1, 'Nadia', 'Olena', 'pending');
    `);

    console.log("Seed completed");
}

seedDb().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});