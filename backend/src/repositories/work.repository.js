import { db } from "../db/connection.js";
import {works, authors, authorWorks, workGenres, items, loans, itemAvailability} from "../db/schema.js";
import {eq, ilike, or, and, sql, asc, desc, count} from "drizzle-orm";
import { normalizeSearch } from "../utils/search.util.js";

// Query base condivisa per findById e findByIdForStaff
const fetchWorkWithRelations = (id, { withLocation = false } = {}) =>
    db.query.works.findFirst({
        where: { id },
        with: {
            authors: true,
            genres: true,
            publisher: true,
            language: true,
            dewey: true,
            country: true,
            items: withLocation
                ? { with: { location: {
                    with : {
                        school: true
                    }
                        } } }
                : true
        }
    });


export const workRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione SQL
        const offset = (page - 1) * limit;

        return await db.query.works.findMany({
            limit: limit,
            offset: offset,
            with: {
                authors: true,
                dewey: true
            }
        });
    },

    findById: async (id) => {
        const [work, availableCount] = await Promise.all([
            // Richiamo la query base senza passare with locations (quindi resta false e non lo ricevo)
            fetchWorkWithRelations(id),
            // Conto il numero di copie disponibili
            db.$count(itemAvailability, eq(itemAvailability.workId, id))
        ]);

        if (!work) return null;
        return { ...work, availableCount };
    },

    findByIdForStaff: async (id) => {
        const [work, availableCount, availableIds] = await Promise.all([
            // Chiamo la query base richiedendo anche la locazione
            fetchWorkWithRelations(id, { withLocation: true }),
            // Conto le copie disponibili
            db.$count(itemAvailability, eq(itemAvailability.workId, id)),
            db
                .select({ itemId: itemAvailability.itemId })
                .from(itemAvailability)
                .where(eq(itemAvailability.workId, id))
        ]);

        if (!work) return null;

        const availableSet = new Set(availableIds.map(r => r.itemId));

        return {
            ...work,
            availableCount,
            items: work.items.map(item => ({
                ...item,
                available: availableSet.has(item.id)
            }))
        };
    },


    findNewest: async (limit) =>
        await db.query.works.findMany({
            limit: limit,
            orderBy: { publicationDate: "desc" },
            with: {
                authors: true,
                dewey: true
            }
        }),


    findMostLoaned: async (limit) => {
        // Recupera gli ID delle opere più prestate con il relativo conteggio
        const ranked = await db
            .select({
                id: works.id,
                loanCount: count(loans.id),
            })
            .from(works)
            .leftJoin(items, eq(items.workId, works.id))
            .leftJoin(loans, eq(loans.itemId, items.id))
            .groupBy(works.id)
            .orderBy(desc(count(loans.id)))
            .limit(limit);

        if (ranked.length === 0) return [];

        const ids = ranked.map(r => r.id);

        // Recupera i dati completi con le relazioni
        const fullWorks = await db.query.works.findMany({
            where: { id: { in: ids } },
            with: {
                authors: true,
                dewey: true,
            }
        });

        // Riordina secondo il ranking originale
        const workMap = new Map(fullWorks.map(w => [w.id, w]));
        return ranked.map(r => workMap.get(r.id)).filter(Boolean);
    },


    // Query per searchbar principale (navbar)
    search: async ({ search, page, limit, genreId, languageCode, publisherId, deweyCode }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        // Parsing di normalizzazione dell'input
        const { term, pattern, isEmpty } = normalizeSearch(search ?? "");

        // Subquery con assegnazione score per il ranking
        const ranked = db
            .selectDistinct({
                id: works.id,
                relevance: sql`
                CASE
                    WHEN ${works.id} = ${term}                                                      THEN 100
                    WHEN LOWER(${works.title}) = LOWER(${term})                                     THEN 90
                    WHEN LOWER(${authors.firstName} || ' ' || ${authors.lastName}) = LOWER(${term}) THEN 80
                    WHEN LOWER(${authors.lastName} || ' ' || ${authors.firstName}) = LOWER(${term}) THEN 80
                    WHEN ${works.title} ILIKE ${term + '%'}                                         THEN 75
                    WHEN LOWER(${authors.lastName}) = LOWER(${term})                                THEN 70
                    WHEN LOWER(${authors.firstName}) = LOWER(${term})                               THEN 65
                    WHEN ${works.title} ILIKE ${'%' + term + '%'}                                   THEN 60
                    WHEN ${authors.lastName} ILIKE ${'%' + term + '%'}                              THEN 50
                    WHEN ${authors.firstName} ILIKE ${'%' + term + '%'}                             THEN 45
                    ELSE 10
                END
            `.as("relevance")
            })
            .from(works)
            .leftJoin(authorWorks, eq(authorWorks.workId, works.id))
            .leftJoin(authors, eq(authors.id, authorWorks.authorId))
            .leftJoin(workGenres, eq(workGenres.workId, works.id))
            .$dynamic();

        const searchConditions = isEmpty ? [] : [
            eq(works.id, term),
            ilike(works.title, pattern),
            ilike(authors.firstName, pattern),
            ilike(authors.lastName, pattern),
            sql`(${authors.firstName} || ' ' || ${authors.lastName}) ILIKE ${pattern}`,
            sql`(${authors.lastName} || ' ' || ${authors.firstName}) ILIKE ${pattern}`,
        ];

        const filterConditions = [
            genreId      ? eq(workGenres.genreId, genreId)         : null,
            languageCode ? eq(works.languageCode, languageCode)    : null,
            publisherId  ? eq(works.publisherId, publisherId)      : null,
            deweyCode    ? ilike(works.deweyCode, deweyCode + '%') : null,
        ].filter(Boolean);

        const allConditions = [
            searchConditions.length > 0 ? or(...searchConditions) : null,
            ...filterConditions,
        ].filter(Boolean);

        if (allConditions.length > 0) {
            ranked.where(and(...allConditions));
        }

        // CTE — ordina e pagina fuori dal DISTINCT
        const sq = ranked.as("ranked");

        const rankedIds = await db
            .select({ id: sq.id, relevance: sq.relevance })
            .from(sq)
            .orderBy(desc(sq.relevance), asc(sq.id))
            .limit(limit)
            .offset(offset);

        if (rankedIds.length === 0) return [];

        // Fetch completo con relazioni
        const ids = rankedIds.map(r => r.id);

        const fullWorks = await db.query.works.findMany({
            where: { id: { in: ids } },
            with: {
                authors: true,
                publisher: true,
                language: true,
                dewey: true,
            }
        });

        // Riordino secondo ranking originale
        const workMap = new Map(fullWorks.map(w => [w.id, w]));
        return rankedIds.map(r => workMap.get(r.id)).filter(Boolean);
    },

    create: async (data) =>
        await db
            .insert(works)
            .values(data)
            .returning(),

    update: async (id, data) =>
        await db
            .update(works)
            .set(data)
            .where(eq(works.id, id))
            .returning(),

    delete: async (id) =>
        await db
            .delete(works)
            .where(eq(works.id, id))
            .returning()
}