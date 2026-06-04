import { db } from "../db/connection.js";
import { languages } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const languageRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return await db.query.languages.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc" }
        });
    },

    findByLanguageCode: async (languageCode) =>
        await db.query.languages.findFirst({
            where: { languageCode: languageCode }
        }),

    create: async (data) =>
        await db.insert(languages).values(data).returning(),

    update: async (languageCode, data) =>
        await db.update(languages).set(data).where(eq(languages.languageCode, languageCode)).returning(),

    delete: async (languageCode) =>
        await db.delete(languages).where(eq(languages.languageCode, languageCode)).returning()
}