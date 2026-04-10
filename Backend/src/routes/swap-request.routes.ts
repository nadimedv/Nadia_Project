import { Router } from "express";
import { swapRequestController } from "../controllers/swap-request.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    createSwapRequestSchema,
    updateSwapRequestSchema
} from "../schemas/swap-request.schema.js";

export const swapRequestRouter = Router();

swapRequestRouter.get("/", swapRequestController.getAll);
swapRequestRouter.get("/:id", swapRequestController.getById);
swapRequestRouter.post("/", validate(createSwapRequestSchema), swapRequestController.create);
swapRequestRouter.put("/:id", validate(updateSwapRequestSchema), swapRequestController.update);
swapRequestRouter.post("/:id/approve", swapRequestController.approve);
swapRequestRouter.delete("/:id", swapRequestController.delete);