import { z } from "zod";

export const createScheduleSchema = z.object({
    date: z.string(),
    shiftId: z.number(),
    note: z.string().optional()
});

export const updateScheduleSchema = createScheduleSchema.partial();