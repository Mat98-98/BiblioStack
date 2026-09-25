import { db } from "../db/connection.js";
import { publishers } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const publisherRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return await db.query.publishers.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc" }
        });
    },

    findById: async (id) =>
        await db.query.publishers.findFirst({
            where: { id: id }
        }),

    search: async ({ page, limit, search }) => {
        const offset = (page - 1) * limit;

        // Filtro opzionale per nome
        const filters = search
        ? { name: { ilike: `%${search}%` }} : undefined;

        // Carico un record in più per controllare se c'è un'altra pagina da mandare
        const list = await db.query.publishers.findMany({
            where: filters,
            offset: offset,
            limit: limit + 1,
            orderBy: { name: "asc" }
        });

        const hasMore = list.length > limit;

        return {
            data: list.slice(0, limit),
            hasMore
        };
    },

    create: async (data) =>
        await db.insert(publishers).values(data).returning(),

    update: async (id, data) =>
        await db.update(publishers).set(data).where(eq(publishers.id, id)).returning(),

    delete: async (id) =>
        await db.delete(publishers).where(eq(publishers.id, id)).returning()
}