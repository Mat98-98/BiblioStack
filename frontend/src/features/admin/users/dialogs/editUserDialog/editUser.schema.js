import { z } from "zod";

export const editUserSchema = z.object({
    firstName: z.string().trim().min(1, "Nome obbligatorio").max(50, "Limite di caratteri raggiunto"),
    lastName:  z.string().trim().min(1, "Cognome obbligatorio").max(50, "Limite di caratteri raggiunto"),
    email:     z.email("Email non valida"),
    phone:     z.string().trim().max(20, "Limite di caratteri raggiunto").optional().nullable(),
})