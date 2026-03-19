import { Router } from "express";
import { shiftController } from "../controllers/shift.controller.js";

export const shiftRouter = Router();

shiftRouter.get("/", shiftController.getAll);
shiftRouter.get("/:id", shiftController.getById);
shiftRouter.post("/", shiftController.create);
shiftRouter.put("/:id", shiftController.update);
shiftRouter.delete("/:id", shiftController.delete);