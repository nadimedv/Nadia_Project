import { Router } from "express";
import { shiftController } from "../controllers/shift.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { demoAuth } from "../middleware/demo-auth.middleware.js";
import { createShiftSchema, updateShiftSchema } from "../schemas/shift.schema.js";

export const shiftRouter = Router();

shiftRouter.use(demoAuth);

shiftRouter.get("/stats/status-counts", shiftController.getStatusCounts);
shiftRouter.get("/", shiftController.getAll);
shiftRouter.get("/:id", shiftController.getById);
shiftRouter.post("/", validate(createShiftSchema), shiftController.create);
shiftRouter.put("/:id", validate(updateShiftSchema), shiftController.update);
shiftRouter.delete("/:id", shiftController.delete);