import { z } from 'zod';

// Schema di validazione per la creazione di un'opera CRUD (senza autore collegato)
export const CreateWorkSchema = z.object({
    publisherId: z.coerce.number().int().positive(),
    deweyCode: z.string(),
    languageCode: z.string().max(3),
    publicationCountry: z.string().max(2).toLowerCase().optional().nullable(),
    title: z.string().max(128),
    otherTitleInformation: z.string().max(255).optional().nullable(),
    description: z.string().max(10000).optional().nullable(),
    pages: z.coerce.number().optional().nullable(),
    publicationDate: z.coerce.date().optional().nullable(),
    coverUrl: z.url().optional().nullable(),
});

export const UpdateWorkSchema = CreateWorkSchema.partial();

// Schema per la validazione dell'input della searchbar
export const WorkSearchSchema = z.object({
    search:       z.string().trim().optional(),
    page:         z.coerce.number().int().positive().default(1),
    limit:        z.coerce.number().int().positive().max(100).default(20),
    genreId:      z.coerce.number().int().positive().optional(),
    publisherId:  z.coerce.number().int().positive().optional(),
    languageCode: z.string().length(3).optional(),
    deweyCode:    z.string().optional(),
});

// Schema per la creazione da dati esterni (Google Books / OpenLibrary) - Rispecchia esattamente l'output del mapper toWorkExternalDTO
export const CreateWorkFromExternalSchema = z.object({

    // Dati identificativi
    isbn: z.string().min(1, "ISBN is required"),

    // Dati testuali — tutti opzionali perché le API esterne potrebbero non averli
    title:           z.string().trim().min(1, "Title is required"),
    subtitle:        z.string().trim().nullable().optional(),
    description:     z.string().trim().nullable().optional(),
    pages:           z.coerce.number().int().positive().nullable().optional(),
    publicationDate: z.coerce.date().nullable().optional(),
    coverUrl:        z.url().nullable().optional(),

    // Publisher — array dal mapper, ma il form invia solo quello selezionato
    publisherName: z.string().trim().nullable().optional(),

    // Authors — array di stringhe "Nome Cognome"
    authors: z.array(
        z.string().trim().min(1)
    ).default([]),

    // Lingua
    languageCode: z.string()
        .length(3, "Language code must be 3 characters")
        .transform(val => val.toLowerCase()) // normalizziamo a lowercase come nel DB
        .nullable()
        .optional(),

    // Campi che il bibliotecario seleziona manualmente nel form
    publicationCountry: z.string().length(2).toLowerCase().nullable().optional(),
    deweyCode:          z.string().nullable().optional(),

    // Generi — array di ID (selezionati manualmente nel form)
    genreIds: z.array(
        z.number().int().positive()
    ).default([]),

    // Autori risolti dal bibliotecario dopo un conflitto
    resolvedAuthors: z.array(z.object({
        inputName: z.string(),
        authorId:  z.number().int().positive().nullable() // Se il bibliotecario sceglie l'opzione "crea nuovo" sarà null
    })).default([])
});