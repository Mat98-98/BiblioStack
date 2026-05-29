import { db } from "../db/connection.js";
import { languages } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const languageRepository = {
    findAll: ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return db.query.languages.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc" }
        });
    },

    findByLanguageCode: (languageCode) =>
        db.query.languages.findFirst({
            where: { languageCode: languageCode }
        }),

    create: (data) =>
        db.insert(languages).values(data).returning(),

    update: (languageCode, data) =>
        db.update(languages).set(data).where(eq(languages.languageCode, languageCode)).returning(),

    delete: (languageCode) =>
        db.delete(languages).where(eq(languages.languageCode, languageCode)).returning()
}