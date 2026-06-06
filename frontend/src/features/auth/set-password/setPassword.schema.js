import { z } from "zod";

export const setPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "La password deve avere almeno 8 caratteri")
            .max(64, "La password deve avere al massimo 64 caratteri")
            .regex(/[a-z]/, "La password deve contenere una lettera minuscola")
            .regex(/[A-Z]/, "La password deve contenere una lettera maiuscola")
            .regex(/[0-9]/, "La password deve contenere un numero")
            .regex(/[^a-zA-Z0-9]/, "La password deve contenere un carattere speciale"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Le password non coincidono",
        path: ["confirmPassword"],
    });