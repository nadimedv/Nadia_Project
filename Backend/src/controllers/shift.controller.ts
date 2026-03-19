import type { Request, Response, NextFunction } from "express";
import { shiftService } from "../services/shift.service.js";
import type { ShiftQueryDto } from "../dtos/shift.dto.js";

export const shiftController = {
    getAll(req: Request, res: Response): void {
        const items = shiftService.getAll(req.query as ShiftQueryDto);
        res.json({ items });
    },

    getById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = shiftService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const item = shiftService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = shiftService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            shiftService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};