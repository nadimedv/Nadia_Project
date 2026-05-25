import type { Request, Response, NextFunction } from "express";
import { shiftService } from "../services/shift.service.js";
import type { ShiftQueryDto } from "../dtos/shift.dto.js";
import { ApiError } from "../errors/api-error.js";

function currentUserId(req: Request): number {
    if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "User context is required");
    }

    return req.user.id;
}

export const shiftController = {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const items = await shiftService.getAll(req.query as ShiftQueryDto, currentUserId(req));
            res.json({ items });
        } catch (e) {
            next(e);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await shiftService.getById(id, currentUserId(req));
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async getStatusCounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const items = await shiftService.getStatusCounts(currentUserId(req));
            res.json({ items });
        } catch (e) {
            next(e);
        }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await shiftService.create(req.body, currentUserId(req));
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await shiftService.update(id, req.body, currentUserId(req));
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            await shiftService.delete(id, currentUserId(req));
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};
