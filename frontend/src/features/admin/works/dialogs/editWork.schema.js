import { z } from "zod";

export const editWorkSchema = z.object({
    publisherId: z.string().trim(),
    deweyCode: z.string().trim(),
    languageCode: z.string().max(3).trim().toLowerCase(),
    publicationCountry: z.string().trim().max(2).optional().nullable(),
    title: z.string().min(1, "Titolo obbligatorio").max(128, "Limite di caratteri raggiunto"),
    otherTitleInformation: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    pages: z.string().optional().nullable(),
    publicationDate: z.string().optional().nullable(),
    coverUrl: z.string().optional().nullable(),
})