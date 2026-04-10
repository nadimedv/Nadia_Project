import { app } from "./app.js";
import { config } from "./config.js";
import { initDb } from "./db/initDb.js";

async function bootstrap() {
    await initDb();

    app.listen(config.port, () => {
        console.log(`API started on http://localhost:${config.port}`);
    });
}

bootstrap().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});