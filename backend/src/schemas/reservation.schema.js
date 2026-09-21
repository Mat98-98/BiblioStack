import { z } from 'zod';
import { ReservationStatusEnum } from "../dto/shared.dto.js";

// Schema di validazione dei dati per la creazione di una prenotazione (ID non serve dato che è generato automaticamente dal database)
export const CreateReservationSchema = z.object({
    workId: z.string()
});

// Schema di validazione dei dati per la modifica di una prenotazione
// La modifica del campo userId e workId non è consentita
export const UpdateReservationSchema = z.object({
    assignedItemId: z.string().nullable().optional(),
    status: ReservationStatusEnum.optional(),
    expiresAt: z.coerce.date().optional()
});

// Schema di validazione filtri di ricerca pagina admin
export const ReservationSearchSchema = z.object({
    search: z.string().optional(),
    status: z.enum(["all", "pending", "ready", "fulfilled", "expired", "cancelled"]).default("all"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    userId: z.coerce.number().int().positive().optional()
});