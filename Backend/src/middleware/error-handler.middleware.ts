import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";

type FieldError = {
    field: string;
    message: string;
};

function sendError(
    res: Response,
    status: number,
    code: string,
    message: string,
    details: unknown = null,
    errors?: FieldError[]
): void {
    res.status(status).json({
        status,
        code,
        message,
        detail: details,
        errors: errors ?? undefined,
        error: {
            code,
            message,
            details
        }
    });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof ApiError) {
        sendError(res, err.status, err.code, err.message, err.details);
        return;
    }

    if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
        }));

        sendError(res, 400, "VALIDATION_ERROR", "Invalid request data", null, errors);
        return;
    }

    console.error("Unhandled error:", err);

    const isDev = process.env.NODE_ENV !== "production";
    const details = isDev && err instanceof Error ? err.message : null;

    sendError(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", details);
}
