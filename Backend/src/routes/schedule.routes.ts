import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller.js";

export const scheduleRouter = Router();

scheduleRouter.get("/", scheduleController.getAll);
scheduleRouter.get("/:id", scheduleController.getById);
scheduleRouter.post("/", scheduleController.create);
scheduleRouter.put("/:id", scheduleController.update);
scheduleRouter.delete("/:id", scheduleController.delete);