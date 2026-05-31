import { publishers, authors, authorWorks, workGenres } from "../db/schema.js";
import { findSimilarAuthor, parseAuthorName } from "./authorResolver.util.js";

export const upsertPublisher = async (tx, publisherName) => {
    if (!publisherName) return null;

    const existing = await tx.query.publishers.findFirst({
        where: { name: publisherName }
    });
    if (existing) return existing.id;

    const [created] = await tx
        .insert(publishers)
        .values({ name: publisherName })
        .returning();
    return created.id;
};

export const resolveLanguage = async (tx, languageCode) => {
    if (!languageCode) return null;
    const lang = await tx.query.languages.findFirst({
        where: { languageCode }
    });
    return lang?.languageCode ?? null;
};

export const linkAuthors = async (tx, workId, authorIds) => {
    if (authorIds.length === 0) return;
    await tx
        .insert(authorWorks)
        .values(authorIds.map(authorId => ({
            authorId,
            workId,
            contributionId: 1
        })))
        .onConflictDoNothing();
};

export const linkGenres = async (tx, workId, genreIds) => {
    if (genreIds.length === 0) return;
    await tx
        .insert(workGenres)
        .values(genreIds.map(genreId => ({ workId, genreId })))
        .onConflictDoNothing();
};

export const createAuthor = async (tx, authorName) => {
    const { firstName, lastName } = parseAuthorName(authorName);
    const [created] = await tx
        .insert(authors)
        .values({ firstName, lastName })
        .returning();
    return created.id;
};

/**
 * Pre-check autori fuori dalla transazione.
 * Restituisce { conflicts, resolved } dove:
 * - conflicts: autori ambigui da far risolvere all'utente
 * - resolved: autori già matchati o nuovi da creare
 */

export const preCheckAuthors = async (authorNames, manualResolutions = new Map()) => {
    const conflicts = []
    const resolved  = []

    for (const authorName of authorNames) {
        if (manualResolutions.has(authorName)) {
            resolved.push({ name: authorName, id: manualResolutions.get(authorName) })
            continue
        }

        const { firstName, lastName } = parseAuthorName(authorName)
        const { match, candidates }   = await findSimilarAuthor(firstName, lastName)

        // Va sempre in conflicts — anche se non ci sono candidati
        conflicts.push({
            inputName:      authorName,
            suggestedMatch: match?.id ?? null,
            candidates:     candidates.map(c => ({
                id:             c.id,
                firstName:      c.firstName,
                lastName:       c.lastName,
                candidateWorks: c.works?.map(w => w.title) ?? []
            }))
        })
    }

    return { conflicts, resolved }
}

/*
export const preCheckAuthors = async (authorNames, manualResolutions = new Map()) => {
    const conflicts = [];
    const resolved  = [];

    for (const authorName of authorNames) {
        if (manualResolutions.has(authorName)) {
            resolved.push({ name: authorName, id: manualResolutions.get(authorName) });
            continue;
        }

        const { firstName, lastName } = parseAuthorName(authorName);
        const { match, candidates }   = await findSimilarAuthor(firstName, lastName);

        if (candidates.length > 0) {
            // Qualsiasi candidato trovato → sempre conflitto, anche se c'è match esatto
            // L'utente deve sempre confermare
            conflicts.push({
                inputName:     authorName,
                suggestedMatch: match?.id ?? null, // pre-seleziona il match se c'è
                candidates:    candidates.map(c => ({
                    id:             c.id,
                    firstName:      c.firstName,
                    lastName:       c.lastName,
                    candidateWorks: c.works?.map(w => w.title) ?? []
                }))
            });
        } else {
            // Nessun candidato → crea nuovo senza chiedere
            resolved.push({ name: authorName, id: null });
        }
    }

    return { conflicts, resolved };
};

 */