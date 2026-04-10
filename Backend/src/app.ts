import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { swapRequestRouter } from "./routes/swap-request.routes.js";
export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);
app.use("/api/swap-requests", swapRequestRouter);