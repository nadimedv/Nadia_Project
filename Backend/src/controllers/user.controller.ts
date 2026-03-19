import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";

export const userController = {
    getAll(req: Request, res: Response): void {
        const items = userService.getAll();
        res.json({ items });
    },

    getById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = userService.getById(id);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const item = userService.create(req.body);
            res.status(201).json({ item });
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            const item = userService.update(id, req.body);
            res.json({ item });
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = Number(req.params.id);
            userService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};