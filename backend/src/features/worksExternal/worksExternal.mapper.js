import { z } from "zod";

/* ---------------- HELPERS ---------------- */

const formatDate = (dateValue) => {
    if (!dateValue) return null;

    // già formato corretto
    if (typeof dateValue === "string") {
        return dateValue.trim();
    }

    // date object
    if (dateValue instanceof Date && !isNaN(dateValue)) {
        return dateValue.toISOString().split("T")[0];
    }

    return null;
};

const extractLanguage = (languages, language) => {
    // se esiste già language normalizzato
    if (language) return language;

    // formato OpenLibrary
    if (!languages?.length) return null;

    const code = languages[0]?.key?.split("/").pop();

    return code ? code.substring(0, 3).toUpperCase() : null;
};

/* ---------------- RAW SCHEMA ---------------- */

const WorkExternalRawSchema = z.object({
    source: z.string().optional().nullable(),

    isbn: z.string().optional(),

    title: z.string().optional().nullable(),

    subtitle: z.string().optional().nullable(),

    description: z
        .union([
            z.string(),

            z.object({
                value: z.string()
            })
        ])
        .optional()
        .nullable(),

    // supporta sia publish_date raw che publicationDate già normalizzato
    publish_date: z.union([
        z.string(),
        z.date()
    ]).optional().nullable(),

    publicationDate: z.union([
        z.string(),
        z.date()
    ]).optional().nullable(),

    // supporta sia pages che number_of_pages
    pages: z.number().optional().nullable(),

    number_of_pages: z.number().optional().nullable(),

    // supporta entrambi i formati
    authors: z.array(
        z.union([
            z.string(),

            z.object({
                name: z.string()
            })
        ])
    ).optional(),

    publishers: z.array(
        z.union([
            z.string(),

            z.object({
                name: z.string()
            })
        ])
    ).optional(),

    // cover già normalizzato
    coverUrl: z.string().optional().nullable(),

    coverLargeUrl: z.string().optional().nullable(),

    // cover raw OpenLibrary
    cover: z.object({
        medium: z.string().optional(),
        large: z.string().optional()
    }).optional(),

    // language già normalizzato
    language: z.string().optional().nullable(),

    // raw OpenLibrary
    languages: z.array(
        z.object({
            key: z.string()
        })
    ).optional()
});

/* ---------------- FINAL DTO ---------------- */

export const WorkExternalDTO = z.object({
    source: z.string().nullable(),

    isbn: z.string(),

    title: z.string().nullable(),

    subtitle: z.string().nullable(),

    description: z.string().nullable(),

    publicationDate: z.string().nullable(),

    authors: z.array(z.string()).default([]),

    publishers: z.array(z.string()).default([]),

    pages: z.number().nullable(),

    language: z.string().nullable(),

    coverUrl: z.string().nullable(),

    coverLargeUrl: z.string().nullable()
});

/* ---------------- MAPPER ---------------- */

export const toWorkExternalDTO = (raw, isbnParam = null) => {
    const work = WorkExternalRawSchema.parse(raw);

    return WorkExternalDTO.parse({
        source: work.source ?? null,

        isbn: work.isbn ?? isbnParam ?? "",

        title: work.title ?? null,

        subtitle: work.subtitle ?? null,

        description:
            typeof work.description === "string"
                ? work.description
                : work.description?.value ?? null,

        publicationDate: formatDate(
            work.publicationDate ??
            work.publish_date
        ),

        authors:
            work.authors?.map((a) =>
                typeof a === "string"
                    ? a
                    : a.name
            ) ?? [],

        publishers:
            work.publishers?.map((p) =>
                typeof p === "string"
                    ? p
                    : p.name
            ) ?? [],

        pages:
            work.pages ??
            work.number_of_pages ??
            null,

        language: extractLanguage(
            work.languages,
            work.language
        ),

        coverUrl:
            work.coverUrl ??
            work.cover?.medium ??
            null,

        coverLargeUrl:
            work.coverLargeUrl ??
            work.cover?.large ??
            null
    });
};