import { z } from "zod"

export const changeRoleSchema = z.object({
    role: z.enum(["admin", "librarian", "user"])
});