import { db } from "../db/connection.js";
import { contributions } from "../db/schema.js";
import {eq} from "drizzle-orm";

export const contributionRepository = {
    findAll: ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return db.query.contributions.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc"}
        });
    },

    findById: (id) =>
        db.query.contributions.findFirst({
            where: { id: id }
        }),

    create: (data) =>
        db.insert(contributions).values(data).returning(),

    update: (id, data) =>
        db.update(contributions).set(data).where(eq(contributions.id, id)).returning(),

    delete: (id) =>
        db.delete(contributions).where(eq(contributions.id, id)).returning()
}