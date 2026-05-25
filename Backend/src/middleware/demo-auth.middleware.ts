import type { NextFunction, Request, Response } from "express";
import { get } from "../db/db.js";
import { ApiError } from "../errors/api-error.js";
import type { User } from "../dtos/user.dto.js";

export async function demoAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const rawUserId = req.header("X-Demo-UserId");

        if (!rawUserId) {
            throw new ApiError(401, "UNAUTHORIZED", "Header X-Demo-UserId is required");
        }

        const userId = Number(rawUserId);

        if (!Number.isInteger(userId) || userId <= 0) {
            throw new ApiError(401, "UNAUTHORIZED", "Invalid demo user");
        }

        const user = await get<User>(
            `SELECT id, name, email FROM Users WHERE id = ?;`,
            [userId]
        );

        if (!user) {
            throw new ApiError(401, "UNAUTHORIZED", "Unknown demo user");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
