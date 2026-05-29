import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una sospensione (ID non serve dato che è generato automaticamente dal database)
export const CreateSuspensionSchema = z.object({
    userId: z.coerce.number().int().positive(),
    handledBy: z.coerce.number().int().positive(),
    reason: z.string().max(2056).optional().nullable(),
    startDate: z.coerce.date().default(() => new Date()), // L'inserimento di data e ora corrente è gestito anche da database
    endDate: z.coerce.date().optional(),
});

// Schema di validazione dei dati per la modifica di una sospensione
// La modifica dei campi userId, handledBy e startDate non è consentita
export const UpdateSuspensionSchema = z.object({
   reason: z.string().max(2056).optional().nullable(),
   endDate: z.coerce.date().optional()
});