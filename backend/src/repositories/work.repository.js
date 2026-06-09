import { db } from "../db/connection.js";
import {works, authors, authorWorks, workGenres, items, loans, itemAvailability} from "../db/schema.js";
import {eq, ilike, or, and, sql, asc, desc, count} from "drizzle-orm";
import { normalizeSearch } from "../utils/search.util.js";

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
            db.query.works.findFirst({
                where: { id },
                with: {
                    authors: true,
                    genres: true,
                    publisher: true,
                    language: true,
                    dewey: true,
                    items: true
                }
            }),
            db.$count(itemAvailability, eq(itemAvailability.workId, id))
        ]);

        if (!work) return null;
        return { ...work, availableCount };
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


    findMostLoaned: async (limit) =>
        await db
            .select({
                id: works.id,
                title: works.title,
                coverUrl: works.coverUrl,

                loanCount: count(loans.id).as("loan_count"),
            })
            .from(works)
            .leftJoin(items, eq(items.workId, works.id))
            .leftJoin(loans, eq(loans.itemId, items.id))
            .groupBy(works.id)
            .orderBy(desc(count(loans.id)))
            .limit(10),


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