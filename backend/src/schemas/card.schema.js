import { z } from "zod";

export const VerifyCardSchema = z.object({
    token: z.string().min(1)
});