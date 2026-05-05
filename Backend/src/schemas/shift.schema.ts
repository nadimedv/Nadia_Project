import { z } from "zod";

export const shiftTimeSlots = [
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00"
] as const;

export const shiftStatuses = ["planned", "done", "canceled"] as const;

export const createShiftSchema = z.object({
    date: z.string().min(1, "Date is required"),
    timeSlot: z.enum(shiftTimeSlots, {
        errorMap: () => ({ message: "Time slot must be selected from the allowed list" })
    }),
    userName: z.string().trim().min(2, "User name must contain at least 2 characters").max(30),
    comment: z.string().max(300).optional().or(z.literal("")),
    status: z.enum(shiftStatuses, {
        errorMap: () => ({ message: "Status must be planned, done or canceled" })
    })
});

export const updateShiftSchema = createShiftSchema.partial();
