import type { Request, Response, NextFunction } from "express";
import { swapRequestService } from "../services/swap-request.service.js";
import { createSwapRequestSchema, updateSwapRequestSchema } from "../schemas/swap-request.schema.js";

export const swapRequestController = {
    getAll(req: Request, res: Response) {
        res.json(swapRequestService.getAll());
    },

    getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            res.json(swapRequestService.getById(id));
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = createSwapRequestSchema.parse(req.body);
            const item = swapRequestService.create(dto);
            res.status(201).json(item);
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const dto = updateSwapRequestSchema.parse(req.body);
            const item = swapRequestService.update(id, dto);
            res.json(item);
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            swapRequestService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};