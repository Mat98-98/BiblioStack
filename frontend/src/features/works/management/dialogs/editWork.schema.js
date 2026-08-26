import { z } from "zod";

export const editWorkSchema = z.object({
    publisherId: z.string().trim(),
    deweyCode: z.string().trim(),
    languageCode: z.string().max(3, "Massimo 3 caratteri: es \"ita\"").trim().toLowerCase(),
    publicationCountry: z.string().trim().max(2, "Massimo 2 caratteri: es \"it\"").toLowerCase().optional().nullable(),
    title: z.string().min(1, "Titolo obbligatorio").max(128, "Limite di caratteri raggiunto"),
    otherTitleInformation: z.string().max(255, "Limite di caratteri raggiunto").optional().nullable(),
    description: z.string().max(10000, "Limite di caratteri raggiunto").optional().nullable(),
    pages: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
        z.number().int("Il numero di pagine deve essere un intero").nonnegative("Il numero di pagine non può essere negativo").optional().nullable()
    ),
    publicationDate: z.string().optional().nullable(),
    coverUrl: z.string().optional().nullable(),
})