import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createScheduleSchema, updateScheduleSchema } from "../schemas/schedule.schema.js";

export const scheduleRouter = Router();

scheduleRouter.get("/with-shifts", scheduleController.getWithShifts);
scheduleRouter.get("/", scheduleController.getAll);
scheduleRouter.get("/:id", scheduleController.getById);
scheduleRouter.post("/", validate(createScheduleSchema), scheduleController.create);
scheduleRouter.put("/:id", validate(updateScheduleSchema), scheduleController.update);
scheduleRouter.delete("/:id", scheduleController.delete);