import { db } from "../db/connection.js";
import { genres } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const genreRepository = {
    findAll: ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return db.query.genres.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc" }
        });
    },

    findById: (id) =>
        db.query.genres.findFirst({
            where: { id: id }
        }),

    create: (data) =>
        db.insert(genres).values(data).returning(),

    update: (id, data) =>
        db.update(genres).set(data).where(eq(genres.id, id)).returning(),

    delete: (id) =>
        db.delete(genres).where(eq(genres.id, id)).returning()
}