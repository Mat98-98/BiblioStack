import { z } from 'zod';

// Schema di validazione dei dati per la creazione di un utente (ID non serve dato che è generato automaticamente dal database)
export const CreateUserSchema = z.object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName:  z.string().trim().min(1).max(50).optional(),
    phone:     z.string().trim().optional().nullable(),
    email:     z.email().trim().toLowerCase(),
    password:  z.string()
        .min(8).max(16)
        .regex(/[a-z]/)
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[!@#$%^&*(),.?":{}|<>]/)
});

// Schema di validazione dei dati per la modifica di un utente
export const UpdateUserSchema = z.object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName:  z.string().trim().min(1).max(50).optional(),
    phone:     z.string().trim().optional().nullable(),
    email:     z.email().toLowerCase().trim().optional(),
    password:  z.string()
        .min(8).max(16)
        .regex(/[a-z]/)
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[!@#$%^&*(),.?":{}|<>]/).optional()
});

// Schema di validazione dei dati per la ricerca degli utenti tramite searchbar
export const UserSearchSchema = z.object({
    search: z.string().trim().optional(),
    page:   z.coerce.number().int().positive().default(1),
    limit:  z.coerce.number().int().positive().max(100).default(20),
});