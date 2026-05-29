import { db } from "../db/connection.js";
import { authors } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const authorRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return db.query.authors.findMany({
            limit : limit,
            offset: offset
        });
    },

    findById: async (id) =>
        db.query.authors.findFirst({
            where: {id: id}
        }),

    /* @todo Da rivedere logica findbyName?
      Al momento se si scrive nome + qualcosa a caso come cognome trova tutti quelli con il nome immesso
    */
    findByName: async (name) => {
        const parts = name.trim().split(" ").filter(Boolean);

        // CASO 1: nome + cognome (prioritario)
        if (parts.length >= 2) {
            const [first, second] = parts;

            const exact = await db.query.authors.findMany({
                where: {
                    AND: [
                        { firstName: { ilike: `%${first}%` } },
                        { lastName: { ilike: `%${second}%` } }
                    ]
                }
            });

            if (exact.length > 0) return exact;
        }

        // CASO 2: fallback singola parola
        const fallback = await db.query.authors.findMany({
            where: {
                OR: parts.map((p) => ({
                    OR: [
                        { firstName: { ilike: `%${p}%` } },
                        { lastName: { ilike: `%${p}%` } }
                    ]
                }))
            }
        });

        return fallback;
    },

    findByLastName: async (lastName) =>
        db.query.authors.findMany({
            where: {
                lastName: lastName
            },
            with: {
                works: {
                    limit: 3,
                    columns: { title: true }
                }
            }
        }),

    create: async (data) =>
         db.insert(authors).values(data).returning(),

    update: async (id, data) =>
        db
            .update(authors)
            .set(data)
            .where(eq(authors.id, id))
            .returning(),

    delete: async (id) =>
        db
            .delete(authors)
            .where(eq(authors.id, id))
            .returning()
};