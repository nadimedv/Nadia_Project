import type { Request, Response, NextFunction } from "express";
import { shiftService } from "../services/shift.service.js";
import { createShiftSchema, updateShiftSchema } from "../schemas/shift.schema.js";

export const shiftController = {
    getAll(req, res) {
        res.json(shiftService.getAll(req.query));
    },

    getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            res.json(shiftService.getById(id));
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = createShiftSchema.parse(req.body);
            const shift = shiftService.create(dto);
            res.status(201).json(shift);
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const dto = updateShiftSchema.parse(req.body);
            const shift = shiftService.update(id, dto);
            res.json(shift);
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            shiftService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};