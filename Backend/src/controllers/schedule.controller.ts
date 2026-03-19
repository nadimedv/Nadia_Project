import type { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/schedule.service.js";
import { createScheduleSchema, updateScheduleSchema } from "../schemas/schedule.schema.js";

export const scheduleController = {
    getAll(req: Request, res: Response) {
        const items = scheduleService.getAll();
        res.json({ items });
    },

    getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            res.json(scheduleService.getById(id));
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = createScheduleSchema.parse(req.body);
            const item = scheduleService.create(dto);
            res.status(201).json(item);
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const dto = updateScheduleSchema.parse(req.body);
            const item = scheduleService.update(id, dto);
            res.json(item);
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            scheduleService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};