import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una segnalazione (ID non serve dato che è generato automaticamente dal database)
export const CreateNoticeSchema = z.object({
    userId: z.coerce.number().int().positive(),
    handledBy: z.coerce.number().int().positive(),
    noticeTypeId: z.coerce.number().int().positive(),
    loanId: z.coerce.number().int().positive(),

    description: z.string().max(2048),
    issuedAt: z.coerce.date()
});

// Schema di validaziome dei dati per la modifica di una segnalazione
// È consentita esclusivamente la modifica sul tipo di segnalazione e sulla descrizione
export const UpdateNoticeSchema = z.object({
   noticeTypeId: z.coerce.number().int().positive(),
   description: z.string().max(2048)
});