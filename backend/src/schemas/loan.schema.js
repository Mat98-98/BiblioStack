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

// Schema di validazione filtri di ricerca pagina admin
export const LoanSearchSchema = z.object({
    search: z.string().optional(),
    status: z.enum(["all", "active", "overdue", "returned"]).default("all"),
    sortBy: z.enum(["loanDate", "dueDate"]).default("loanDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    workId: z.string().optional(),
    userId: z.coerce.number().int().positive().optional()
})