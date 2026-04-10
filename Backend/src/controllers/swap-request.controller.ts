import type { Request, Response, NextFunction } from "express";
import { swapRequestService } from "../services/swap-request.service.js";

export const swapRequestController = {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const items = await swapRequestService.getAll();
            res.json({ items });
        } catch (e) {
            next(e);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await swapRequestService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await swapRequestService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await swapRequestService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            await swapRequestService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    },

    async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await swapRequestService.approve(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    }
};