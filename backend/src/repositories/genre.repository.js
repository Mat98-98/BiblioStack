import { db } from "../db/connection.js";
import { genres } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const genreRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return await db.query.genres.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc" }
        });
    },

    findById: async (id) =>
        await db.query.genres.findFirst({
            where: { id: id }
        }),

    create: async (data) =>
        await db.insert(genres).values(data).returning(),

    update: async (id, data) =>
        await db.update(genres).set(data).where(eq(genres.id, id)).returning(),

    delete: async (id) =>
        await db.delete(genres).where(eq(genres.id, id)).returning()
}