import { db } from "../db/connection.js";
import { works } from "../db/schema.js";
import { workRepository } from "../repositories/work.repository.js";
import { AppError } from "../utils/appError.js";
import { toWorkExternalDTO } from "../features/worksExternal/worksExternal.mapper.js";
import { worksExternalService } from "../features/worksExternal/worksExternal.service.js";

import {
    upsertPublisher,
    resolveLanguage,
    linkAuthors,
    linkGenres,
    createAuthor,
    preCheckAuthors
} from "../utils/workBuilder.util.js";

// Funzione per verificare l'esistenza di un'opera, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const work = await workRepository.findById(id);
    if (!work) throw new AppError("Work not found", "NOT_FOUND", 404);
    return work;
};

export const workService = {

    getAll: async ({ page, limit }) =>
        await workRepository.findAll({ page, limit }),

    getById: async (id, forStaff = false) => {
        // Se viene passato forStaff = true faccio la query riservata allo staff, altrimenti quella per gli utenti base
        const work = forStaff ? await workRepository.findByIdForStaff(id) : await workRepository.findById(id);

        if (!work) throw new AppError("Work not found", "NOT_FOUND", 404);

        return work;
    },

    getNewest: async (limit) =>
        await workRepository.findNewest(limit),

    getMostLoaned: async (limit) =>
        await workRepository.findMostLoaned(limit),

    search: async (params) =>
        await workRepository.search(params),

    // Wrapper per flaggare se l'opera è stata trovata internamente o esternamente (per aggiungere nuova opera o solamente copie se esiste già)
    lookup: async (isbn) => {
        // Cerca prima nel db
        const existing = await workRepository.findById(isbn);
        if (existing) {
            return { source: "internal", work: existing };
        }

        // Se non trovato nel db cerca nelle API esterne
        const external = await worksExternalService.getByISBN(isbn);
        return { source: "external", work: toWorkExternalDTO(external, isbn) };
    },

    create: async (data) => {
        const [newWork] = await workRepository.create(data);
        return await workRepository.findById(newWork.id);
    },

    createFromExternal: async (data) => {
        // Risoluzioni manuali dell'utente (dopo un conflitto)
        const manualResolutions = new Map(
            data.resolvedAuthors.map(r => [r.inputName, r.authorId])
        );

        // Pre-check autori
        const { conflicts, resolved } = await preCheckAuthors(
            data.authors,
            manualResolutions
        );

        if (conflicts.length > 0) {
            throw new AppError(
                "Author confirmation required",
                "AUTHOR_CONFLICT",
                409,
                conflicts
            );
        }

        return db.transaction(async (tx) => {
            const publisherId  = await upsertPublisher(tx, data.publisherName);
            const languageCode = await resolveLanguage(tx, data.languageCode);

            const [newWork] = await tx
                .insert(works)
                .values({
                    id:                     data.isbn,
                    title:                  data.title,
                    otherTitleInformation:  data.subtitle               ?? null,
                    description:            data.description            ?? null,
                    pages:                  data.pages                  ?? null,
                    publicationDate:        data.publicationDate        ?? null,
                    publicationCountry:     data.publicationCountry     ?? null,
                    deweyCode:              data.deweyCode              ?? null,
                    coverUrl:               data.coverUrl               ?? null,
                    publisherId,
                    languageCode
                })
                .returning();

            const finalAuthorIds = await Promise.all(
                resolved.map(r => r.id
                    ? Promise.resolve(r.id)
                    : createAuthor(tx, r.name)
                )
            );

            await linkAuthors(tx, newWork.id, finalAuthorIds);
            await linkGenres(tx, newWork.id, data.genreIds);

            return tx.query.works.findFirst({
                where: { id: newWork.id },
                with: {
                    authors:   true,
                    publisher: true,
                    language:  true,
                    dewey:     true,
                    genres:    true,
                    items:     true,
                }
            });
        });
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        await workRepository.update(id, data);
        return await workRepository.findById(id);
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await workRepository.delete(id);
        return { message: "Work successfully deleted" };
    }
};