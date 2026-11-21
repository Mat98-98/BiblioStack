import { z } from 'zod';

// Schema di validazione dei dati per la creazione di una copia
export const CreateItemSchema = z.object({
    id:              z.string().min(1, "Location id is required"),
    workId:          z.string().min(1, "workId is required"),
    locationId:      z.number().int().positive().optional().nullable(),
    currencyCode:    z.string().length(3).optional().nullable(),
    acquisitionDate: z.coerce.date().optional().nullable(),
    price:           z.coerce.number().positive().optional().nullable()
});

// Schema di supporto per la validazione dello stato di una copia
export const ItemStatusSchema = z.enum([
    "active",
    "damaged",
    "lost"
]);

// Schema di validazione dei dati per la modifica della posizione, valuta, data di acquisizione, prezzo e stato di una copia
export const UpdateItemSchema = z.object({
    locationId:      z.number().int().positive().optional().nullable(),
    currencyCode:    z.string().length(3).optional().nullable(),
    acquisitionDate: z.coerce.date().optional().nullable(),
    price:           z.coerce.number().positive().optional().nullable(),
    status: ItemStatusSchema.optional()
});