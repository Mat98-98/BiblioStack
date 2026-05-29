import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una lingua
export const CreateLanguageSchema = z.object({
    languageCode: z.string().min(3).max(3),
    name: z.string().min(1).max(32)
});

// Schema di validazione dei dati per la modifica di una lingua - La modifica del codice (es. ita) non è consentita
export const UpdateLanguageSchema = z.object({
    name: z.string().min(1).max(128)
});