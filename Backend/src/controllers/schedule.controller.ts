import type { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/schedule.service.js";

export const scheduleController = {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const items = await scheduleService.getAll();
            res.json({ items });
        } catch (e) {
            next(e);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await scheduleService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async getWithShifts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const items = await scheduleService.getWithShifts(req.query as Record<string, string | undefined>);
            res.json({ items });
        } catch (e) {
            next(e);
        }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await scheduleService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await scheduleService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            await scheduleService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};