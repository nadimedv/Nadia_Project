import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";

export const userController = {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const items = await userService.getAll();
            res.json({ items });
        } catch (e) {
            next(e);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await userService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await userService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const item = await userService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            await userService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};