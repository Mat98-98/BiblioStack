import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import { normalizeSearch } from "../utils/search.util.js";
import { eq, ilike, or, sql, desc } from "drizzle-orm";

// Helper per mappare gli utenti con sospensioni attive
function mapUserWithSuspension(user) {
    const { activeSuspension, ...rest } = user;
    return {
        ...rest,
        suspension: activeSuspension
            ? { reason: activeSuspension.reason, endDate: activeSuspension.endDate }
            : null
    };
}

export const userRepository = {
    findAll: async ({ page, limit }) => {
        const offset = (page - 1) * limit;

        const results = await db.query.users.findMany({
            offset: offset,
            limit: limit,
            with: {
                role: true,
                activeSuspension: true
            }
        });
        return results.map(mapUserWithSuspension);
    },

    findById: async (id) => {

        const user = await db.query.users.findFirst({
            where: {id: id},
            with: {
                role: true,
                activeSuspension: true,
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
        });
        return user ? mapUserWithSuspension(user) : null;
    },

    findByEmail: async (email) =>
        await db.query.users.findFirst({
            where: { email: email },
            with: { role: true }
        }),

    // Query di estrazione dati per la dashboard utente (sia visione studente che admin)
    findUserProfileDataById: async (id) => {
        const user = await db.query.users.findFirst({
            where: {id: id},
            with: {
                role: true,
                activeSuspension: true,
                loansAsPatron: {
                    with: {item: true}
                },
                reservations: {
                    with: {work: true}
                },
                noticesReceived: {
                    with: {type: true}
                },
                noticesHandled: {
                    with: {type: true}
                }
            }
        });
        return user ? mapUserWithSuspension(user) : null;
    },

    findActiveSuspension: async (userId) =>
        await db.query.activeSuspensions.findFirst({
            where: { userId: userId }
        }),

    create: (data) =>
        db
            .insert(users)
            .values(data)
            .returning(),

    update: async (id, data) => {
        await db.update(users).set(data).where(eq(users.id, id))
        return db.query.users.findFirst({
            where: { id },
            with: { role: true }
        })
    },

    delete: async (id) =>
        await db.delete(users).where(eq(users.id, id)).returning(),


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

        // Prendo gli ID ordinati
        const rankedIds = await db
            .select({id: sq.id, relevance: sq.relevance})
            .from(sq)
            .orderBy(desc(sq.relevance))
            .limit(limit)
            .offset(offset);

        if (rankedIds.length === 0) return [];

        const ids = rankedIds.map(r => r.id);

        // Ricarico con le relazioni
        const fullUsers = await db.query.users.findMany({
            where: {id: {in: ids}},
            with: {
                role: true,
                activeSuspension: true
            }
        });

        const userMap = new Map(fullUsers.map(u => [u.id, mapUserWithSuspension(u)]));
        return rankedIds.map(r => userMap.get(r.id)).filter(Boolean);
    }
};