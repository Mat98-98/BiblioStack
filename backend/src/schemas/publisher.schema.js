import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una casa editrice (ID non serve dato che è generato automaticamente dal database)
export const CreatePublisherSchema = z.object({
    name: z.string().min(1).max(128)
});

// Schema di validazione dei dati per la modifica di una casa editrice
export const UpdatePublisherSchema = CreatePublisherSchema.partial();

// Schema di validazione filtri di ricerca
export const PublisherSearchSchema = z.object({
    search: z.string().optional()
});