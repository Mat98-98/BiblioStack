import { z } from "zod";

export const addLoanSchema = z.object({
    userId: z.coerce.number().int().positive({ message: "Seleziona un utente" }),
    itemId: z.string().min(1, "Inserisci il codice inventario della copia"),
    dueDate: z.coerce.date({ required_error: "Imposta una data di scadenza" })
});

export const quickCheckInSchema = z.object({
    itemId: z.string().min(1, "Inserisci il codice inventario della copia")
})

export const editLoanSchema = z.object({
    dueDate: z.coerce.date({ required_error: "Imposta una data di scadenza" }),
    returnDate: z.coerce.date().nullable().optional()
})