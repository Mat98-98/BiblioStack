import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import { normalizeSearch } from "../utils/search.util.js";
import { eq, ilike, or, sql, desc } from "drizzle-orm";

export const userRepository = {
    findAll: ({ page, limit }) => {
        const offset = (page - 1) * limit;

        return db.query.users.findMany({
            offset: offset,
            limit: limit,
            with: {
                role: true
            }
        });
    },

    findById: (id) =>
        db.query.users.findFirst({
            where: { id: id },
            with: {
                role: true,
                loansAsPatron: {
                    with: {
                        item: true
                    }
                },
                reservations: {
                    with: {
                        work: true
                    }
                }
            }
        }),

    findByEmail: (email) =>
        db.query.users.findFirst({
            where: { email: email },
            with: { role: true }
        }),

    // Query di estrazione dati per la dashboard utente (sia visione studente che admin)
    findUserProfileDataById: (id) =>
        db.query.users.findFirst({
            where: { id: id },
            with: {
                role: true,
                loansAsPatron: {
                    with: { item: true }
                },
                reservations: {
                    with: { work: true }
                },
                noticesReceived: {
                    with: { type: true }
                },
                noticesHandled: {
                    with: { type: true }
                }
            }
        }),

    create: (data) =>
        db
            .insert(users)
            .values(data)
            .returning(),

    update: (id, data) =>
        db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning(),

    delete: (id) =>
        db
            .delete(users)
            .where(eq(users.id, id))
            .returning(),


    search: async ({ search, page, limit }) => {

        // Calcolo l'offset per la paginazione
        const offset = (page - 1) * limit;

        // Parsing della stringa in input
        const {term, pattern, isEmpty} = normalizeSearch(search);


        // Subquery per assegnare lo score ai risultati
        let inner = db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            roleId: users.roleId,
            relevance: sql`
                CASE
                    WHEN CAST (${users.id} AS TEXT) = ${term} THEN 100                               -- Se l'id utente corrisponde assegno score di 100 
                    WHEN ${users.email} ILIKE ${term} THEN 90                                        -- Se l'email corrisponde assegno score di 90
                    WHEN (${users.firstName} || ' ' || ${users.lastName}) ILIKE ${term} THEN 85      -- Se nome e cognome corrispondono assegno score di 85
                    WHEN ${users.lastName} ILIKE ${term + '%'} THEN 70                               -- Se il cognome corrisponde assegno score di 70
                    WHEN ${users.firstName} ILIKE ${term + '%'} THEN 60                              -- Se il nome corrisponde assegno score di 60
                    ELSE 10
                    END
                `.as("relevance")
        })
            .from(users)
            .$dynamic();

        if (!isEmpty) {
            inner = inner.where(
                or(
                    ilike(users.firstName, pattern),
                    ilike(users.lastName, pattern),
                    ilike(users.email, pattern),
                    sql`(${users.firstName} || ' ' || ${users.lastName}) ILIKE ${pattern}`,
                    sql`(${users.lastName} || ' ' || ${users.firstName})ILIKE ${pattern}`,
                    sql`CAST(${users.id} AS TEXT) = ${term}`
                )
            );
        }

        const sq = inner.as("ranked");

        // Step 2: prendi gli ID ordinati e ricarica con relazioni
        const rankedIds = await db
            .select({id: sq.id, relevance: sq.relevance})
            .from(sq)
            .orderBy(desc(sq.relevance))
            .limit(limit)
            .offset(offset);

        if (rankedIds.length === 0) return [];

        const ids = rankedIds.map(r => r.id);

        const fullUsers = await db.query.users.findMany({
            where: {id: {in: ids}},
            with: {role: true}
        });

        const userMap = new Map(fullUsers.map(u => [u.id, u]));
        return rankedIds.map(r => userMap.get(r.id)).filter(Boolean);
    }
};