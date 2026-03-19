import type { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/schedule.service.js";

export const scheduleController = {
    getAll(req: Request, res: Response): void {
        const items = scheduleService.getAll();
        res.json({ items });
    },

    getById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = scheduleService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const item = scheduleService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = scheduleService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            scheduleService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};