import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { securityHeaders } from "./middleware/security-headers.middleware.js";

export const app = express();

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("CORS: origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"]
};

app.use(securityHeaders);
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.use("/api/v1", apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);
