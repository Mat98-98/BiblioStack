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