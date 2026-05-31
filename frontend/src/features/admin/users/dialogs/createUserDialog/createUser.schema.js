import { z } from "zod"

export const createUserSchema = z.object({
    firstName: z.string().trim().min(1, "Nome obbligatorio").max(50),
    lastName:  z.string().trim().min(1, "Cognome obbligatorio").max(50),
    email:     z.email("Email non valida"),
    phone:     z.string().trim().max(20, "Limite di caratteri raggiunto").optional().nullable(),
    password:  z.string()
        .min(8, "Minimo 8 caratteri")
        .max(16, "Massimo 16 caratteri")
        .regex(/[a-z]/, "Deve contenere almeno una lettera minuscola")
        .regex(/[A-Z]/, "Deve contenere almeno una lettera maiuscola")
        .regex(/[0-9]/, "Deve contenere almeno un numero")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Deve contenere almeno un carattere speciale")
});