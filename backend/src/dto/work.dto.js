import { z } from 'zod';
import {AuthorDTO} from "./shared.dto.js";

/* ---------------- COMMON ---------------- */

const GenreSchema = z.object({
    id: z.number(),
    name: z.string()
});

const ItemSchema = z.object({
    id: z.string(),
    price: z.coerce.number().nullable(),
    acquisitionDate: z.date().nullable()
});

const PublisherSchema = z.object({
    id: z.number(),
    name: z.string()
});

const LanguageSchema = z.object({
    languageCode: z.string(),
    name: z.string()
});

const DeweySchema = z.object({
    code: z.string(),
    description: z.string().nullable()
});

/* ---------------- CORE ---------------- */

const WorkCore = {
    id: z.string(),
    title: z.string(),
    publicationDate: z.date().nullable().optional()
};

/* ---------------- BASE ---------------- */

export const WorkBaseDTO = z.object({
    ...WorkCore,
    coverUrl: z.string().optional().nullable(),
    authors: z.array(AuthorDTO).default([])
});

export const WorkBaseListDTO = z.array(WorkBaseDTO);

/* ---------------- DETAIL ---------------- */

export const WorkDetailDTO = z.object({
    ...WorkCore,

    authors: z.array(AuthorDTO).default([]),
    genres: z.array(GenreSchema).default([]),
    items: z.array(ItemSchema).default([]),

    publisher: PublisherSchema.nullable().optional(),
    language: LanguageSchema.nullable().optional(),
    dewey: DeweySchema.nullable().optional(),
    coverUrl: z.string().nullable().optional(),
    description: z.string().nullable().optional()
});


// DTO ottimizzato per la lista risultati search
export const WorkSearchResultDTO = z.object({
    id: z.string(),
    title: z.string(),
    publicationDate: z.date().nullable(),
    authors: z.array(AuthorDTO).default([]),
    publisher: PublisherSchema.nullable().optional(),
    language: LanguageSchema.nullable().optional(),
    dewey: DeweySchema.nullable().optional(),
    coverUrl: z.string().optional().nullable()
});

export const WorkSearchResultListDTO = z.array(WorkSearchResultDTO);