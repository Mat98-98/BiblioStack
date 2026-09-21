import { db } from "../db/connection.js";
import { items, itemAvailability } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const itemRepository = {

    findAll: async ({ page, limit }) => {
        const offset = limit * (page - 1);
        return await db.query.items.findMany({
            limit,
            offset,
            columns: { price: false },
            with: { work: { columns: { id: true, title: true }}}
        });
    },

    findById: async (id, tx = db) =>
        await tx.query.items.findFirst({
            where: { id },
            with: {
                work: { columns: { id: true, title: true }},
                location: {
                    with: { school: true }
                },
                loans: {
                    limit: 1,
                    orderBy: { loanDate: "desc" }
                }
            }
        }),


    // Trova il primo item disponibile per un'opera, se esiste lo ritorna completo di work
    findAvailableByWorkId: async (workId, tx = db) => {
        // Cerca nella vista un item disponibile per l'opera
        const [available] = await tx
            .select()
            .from(itemAvailability)
            .where(eq(itemAvailability.workId, workId))
            .limit(1);

        if (!available) return null;


        // Recupera l'item completo con i dati dell'opera e la locazione della copia
        return tx.query.items.findFirst({
            where: { id: available.itemId },
            with: {
                work: { columns: { id: true, title: true }},
                location: {
                    with: { school: true }
                }
            }
        });
    },

    create: async (data) =>
        await db.insert(items).values(data).returning(),

    update: async (id, data) =>
        await db.update(items).set(data).where(eq(items.id, id)).returning(),

    delete: async (id) =>
        await db.delete(items).where(eq(items.id, id)).returning(),
};