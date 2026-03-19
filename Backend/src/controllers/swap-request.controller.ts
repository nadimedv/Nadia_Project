import type { Request, Response, NextFunction } from "express";
import { swapRequestService } from "../services/swap-request.service.js";

export const swapRequestController = {
    getAll(req: Request, res: Response): void {
        const items = swapRequestService.getAll();
        res.json({ items });
    },

    getById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = swapRequestService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const item = swapRequestService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = swapRequestService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            swapRequestService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};