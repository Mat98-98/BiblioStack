import { z } from 'zod';

// Schema di validazione per la creazione di un autore (ID non serve dato che è generato automaticamente dal database)
export const CreateAuthorSchema = z.object({
    firstName: z.string().min(1).max(64).optional(),
    lastName: z.string().min(1).max(64).optional()
});

// Schema di validazione per la modifica di un autore (tutti i campi sono modificabili tranne ID)
export const UpdateAuthorSchema = CreateAuthorSchema.partial();