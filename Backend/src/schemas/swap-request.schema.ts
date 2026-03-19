import { z } from "zod";

export const createSwapRequestSchema = z.object({
    shiftId: z.number(),
    requestedBy: z.string(),
    targetUser: z.string(),
    status: z.enum(["pending", "approved", "rejected"])
});

export const updateSwapRequestSchema = createSwapRequestSchema.partial();