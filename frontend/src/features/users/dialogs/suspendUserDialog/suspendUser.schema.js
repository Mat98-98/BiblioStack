import { z } from "zod";

export const suspendUserSchema = z.object({
    reason: z.string().max(2056, "Limite di caratteri raggiunto").optional().nullable(),
    endDate: z.string().optional().nullable()
})