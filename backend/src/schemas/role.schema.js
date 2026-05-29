import { z } from "zod"

export const ChangeRoleSchema = z.object({
    userId:  z.coerce.number().int().positive(),
    newRole: z.enum(["student", "librarian", "admin"]),
})