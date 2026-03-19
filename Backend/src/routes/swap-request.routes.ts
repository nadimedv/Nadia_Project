import { Router } from "express";
import { swapRequestController } from "../controllers/swap-request.controller.js";

export const swapRequestRouter = Router();

swapRequestRouter.get("/", swapRequestController.getAll);
swapRequestRouter.get("/:id", swapRequestController.getById);
swapRequestRouter.post("/", swapRequestController.create);
swapRequestRouter.put("/:id", swapRequestController.update);
swapRequestRouter.delete("/:id", swapRequestController.delete);