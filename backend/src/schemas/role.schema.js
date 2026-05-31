import { z } from "zod"

export const ChangeRoleSchema = z.object({
    role: z.enum(["student", "librarian", "admin"]),
})