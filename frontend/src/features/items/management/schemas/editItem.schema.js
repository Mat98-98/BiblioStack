import { z } from "zod";

export const editItemSchema = z.object({
    locationId: z.number().nullable(),
    currencyCode: z.string().nullable(),
    acquisitionDate: z.string().nullable(),
    price: z.coerce.number().nullable(),
    status: z.enum(["active", "damaged", "lost"])
});