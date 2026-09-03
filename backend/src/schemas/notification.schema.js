import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una notifica (ID non serve, è generato in automatico)
export const CreateNotificationSchema = z.object({
    userId: z.number().int().positive(),
    title: z.string().min(1).max(64),
    message: z.string().min(1).max(255),
});

// Schema di validazione per marcare come letta la notifica
export const MarkNotificationAsReadSchema = z.object({
    id: z.coerce.number().int().positive(),
});

