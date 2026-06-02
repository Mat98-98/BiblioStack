import { z } from "zod"

export const workFormSchema = z.object({
    isbn:               z.string().min(1, "ISBN obbligatorio"),
    title:              z.string().min(1, "Titolo obbligatorio"),
    subtitle:           z.string().optional().nullable(),
    description:        z.string().optional().nullable(),
    publicationDate:    z.string().optional().nullable(),
    publisherName:      z.string().optional().nullable(),
    authors:            z.array(z.string()).min(1, "Almeno un autore obbligatorio"),
    pages:              z.coerce.number().int().positive("Deve essere un numero positivo").optional().or(z.literal("")),
    languageCode:       z.string().max(3).optional().nullable(),
    coverUrl:           z.string().url("URL non valido").optional().or(z.literal("")),
    publicationCountry: z.string().length(2, "Deve essere un codice di 2 lettere").toLowerCase().optional().nullable(),
    deweyCode:          z.string().optional().nullable(),
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