import type { NextFunction, Request, Response } from "express";

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: `Route ${req.method} ${req.originalUrl} not found`,
            details: null
        }
    });
}