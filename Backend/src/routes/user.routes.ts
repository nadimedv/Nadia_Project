import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";

export const userRouter = Router();

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getById);
userRouter.post("/", validate(createUserSchema), userController.create);
userRouter.put("/:id", validate(updateUserSchema), userController.update);
userRouter.delete("/:id", userController.delete);