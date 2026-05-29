import { z } from 'zod';

// Schema di validazione dei dati per la creazione di un tipo di contributo (ID non serve dato che è generato automaticamente dal database)
export const CreateContributionSchema = z.object({
    name: z.string().min(1).max(128)
});

// Schema di validazione dei dati per la modifica di un contributo
export const UpdateContributionSchema = CreateContributionSchema.partial();