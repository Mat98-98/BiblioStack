import { z } from "zod";

export const RoleSchema = z.enum([
    "admin",
    "librarian",
    "user"
]);

export const ChangeRoleSchema = z.object({
    role: RoleSchema
});