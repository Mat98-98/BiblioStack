import { z } from "zod";

export const createNoticeSchema = z.object({
    noticeTypeId: z.coerce.number().int().positive({ message: "Seleziona una categoria per la segnalazione"}),
    description: z.string().min(1, "La descrizione è obbligatoria").max(2048, "Limite di carattere raggiunto")
});