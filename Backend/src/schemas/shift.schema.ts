import { z } from "zod";

export const createShiftSchema = z.object({
    date: z.string(),
    timeSlot: z.string(),
    userName: z.string().min(2),
    comment: z.string().optional(),
    status: z.enum(["planned", "done", "canceled"])
});

export const updateShiftSchema = createShiftSchema.partial();