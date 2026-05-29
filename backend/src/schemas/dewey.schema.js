import { z } from 'zod';

// Schema di validazione dei dati per la creazione di un tipo di un codice Dewey
export const CreateDeweySchema = z.object({
    code: z.string().min(1).max(16),
    description: z.string().max(255).optional()
});

// Schema di validazione dei dati per la modifica di un codice dewey (la modifica del codice effettivo non è ammessa)
export const UpdateDeweySchema =  z.object({
    description: z.string().max(255).optional()
});