import { db } from "../db/connection.js";
import { contributions } from "../db/schema.js";
import {eq} from "drizzle-orm";

export const contributionRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return await db.query.contributions.findMany({
            offset: offset,
            limit: limit,
            orderBy: { name: "asc"}
        });
    },

    findById: async (id) =>
        await db.query.contributions.findFirst({
            where: { id: id }
        }),

    create: async (data) =>
        await db.insert(contributions).values(data).returning(),

    update: async (id, data) =>
        await db.update(contributions).set(data).where(eq(contributions.id, id)).returning(),

    delete: async (id) =>
        await db.delete(contributions).where(eq(contributions.id, id)).returning()
}