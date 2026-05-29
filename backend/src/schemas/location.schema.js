import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una locazione (ID non serve dato che è generato automaticamente dal database)
export const CreateLocationSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    shelfCode: z.string().max(255)
});

// Schema di validazione dei dati per la modifica di una locazione
export const UpdateLocationSchema = CreateLocationSchema.partial();