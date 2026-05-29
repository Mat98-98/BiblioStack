import { z } from 'zod';

// Schema di validazione dei dati per la creazione di un prestito (ID non serve dato che è generato automaticamente dal database)
export const CreateLoanSchema = z.object({
    userId: z.coerce.number().int().positive(),
    itemId: z.string(),
    handledBy: z.coerce.number().int().positive(),

    loanDate: z.coerce.date().default(() => new Date()),
    dueDate: z.coerce.date(),
    returnDate: z.coerce.date().nullable().optional()

});

// Schema di validazione dei dati per la modifica di un prestito
// La modifica è consentita solo per la data di scadenza del prestito e per la data di ritorno del libro
export const UpdateLoanSchema = z.object({
    dueDate: z.coerce.date(),
    returnDate: z.coerce.date().nullable().optional(),
})