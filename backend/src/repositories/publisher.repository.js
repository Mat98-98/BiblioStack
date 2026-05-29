import { db } from "../db/connection.js";
import { publishers } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const publisherRepository = {
    findAll: ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return db.query.publishers.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc" }
        });
    },

    findById: (id) =>
        db.query.publishers.findFirst({
            where: { id: id }
        }),

    create: (data) =>
        db.insert(publishers).values(data).returning(),

    update: (id, data) =>
        db.update(publishers).set(data).where(eq(publishers.id, id)).returning(),

    delete: (id) =>
        db.delete(publishers).where(eq(publishers.id, id)).returning()
}