import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ApiError) {
        res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data",
                details: err.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            }
        });
        return;
    }

    console.error("Unhandled error:", err);

    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Unexpected server error",
            details: null
        }
    });
}