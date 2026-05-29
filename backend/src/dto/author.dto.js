import { z } from 'zod';

/* ---------------- COMMON ---------------- */

const WorkMiniSchema = z.object({
    id: z.string(),
    title: z.string()
});

/* ---------------- CORE ---------------- */

const AuthorCore = {
    id: z.number(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable()
};

/* ---------------- BASE ---------------- */

// Usato per autocomplete / liste
export const AuthorBaseDTO = z.object({
    ...AuthorCore
});

export const AuthorBaseListDTO = z.array(AuthorBaseDTO);

/* ---------------- WITH WORKS (AUTOCOMPLETE POTENZIATO) ---------------- */

// per dropdown con libri suggeriti
export const AuthorWithWorksDTO = z.object({
    ...AuthorCore,
    works: z.array(WorkMiniSchema).default([])
});

export const AuthorWithWorksListDTO = z.array(AuthorWithWorksDTO);

/* ---------------- DETAIL ---------------- */

// pagina autore
export const AuthorDetailDTO = z.object({
    ...AuthorCore,
    works: z.array(WorkMiniSchema).default([])
});