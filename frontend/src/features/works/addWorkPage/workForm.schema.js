import { z } from "zod"

export const workFormSchema = z.object({
    isbn:               z.string().min(1, "ISBN obbligatorio"),
    title:              z.string().min(1, "Titolo obbligatorio"),
    subtitle:           z.string().optional(),
    description:        z.string().optional(),
    publicationDate:    z.string().optional(),
    publisherName:      z.string().optional(),
    authors:            z.array(z.string()).min(1, "Almeno un autore obbligatorio"),
    pages:              z.coerce.number().int().positive("Deve essere un numero positivo").optional().or(z.literal("")),
    languageCode:       z.string().max(3).optional(),
    coverUrl:           z.string().url("URL non valido").optional().or(z.literal("")),
    publicationCountry: z.string().length(2, "Deve essere un codice di 2 lettere").toUpperCase().optional().nullable(),
    deweyCode:          z.string().optional(),
    genreIds:           z.array(z.number()).default([]),
})

export const emptyWorkForm = {
    isbn:               "",
    title:              "",
    subtitle:           "",
    description:        "",
    publicationDate:    "",
    publisherName:      "",
    authors:            [],
    pages:              "",
    languageCode:       "",
    coverUrl:           "",
    publicationCountry: "",
    deweyCode:          "",
    genreIds:           [],
    resolvedAuthors:    [],
}