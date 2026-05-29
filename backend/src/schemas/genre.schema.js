import { z } from 'zod';

// Schema di validazione dei dati per la creazione di un genere (ID non serve dato che è generato automaticamente dal database)
export const CreateGenreSchema = z.object({
    name: z.string().min(1).max(128)
});

// Schema di validazione dei dati per la modifica di un genere
export const UpdateGenreSchema = CreateGenreSchema.partial();