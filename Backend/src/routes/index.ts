import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
});
import { userRouter } from "./user.routes.js";

apiRouter.use("/users", userRouter);
import { shiftRouter } from "./shift.routes.js";

apiRouter.use("/shifts", shiftRouter);