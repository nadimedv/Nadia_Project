import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";

export const userController = {
    getAll(req: Request, res: Response) {
        res.json(userService.getAll());
    },

    getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            res.json(userService.getById(id));
        } catch (e) {
            next(e);
        }
    },

    create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = createUserSchema.parse(req.body);
            const user = userService.create(dto);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    },

    update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const dto = updateUserSchema.parse(req.body);
            const user = userService.update(id, dto);
            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            userService.delete(id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
};