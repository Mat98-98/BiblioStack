import { db } from "../db/connection.js";
import { deweyCodes } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const deweyCodeRepository = {
    findAll: async ({page, limit}) => {
        // Calcolo offset per la paginazione SQL
        const offset = (page - 1) * limit;

        return await db.query.deweyCodes.findMany({
            limit: limit,
            offset: offset,
            orderBy: { code: "asc" }
        });
    },

    findByCode: async (code) =>
        await db.query.deweyCodes.findFirst({
            where: { code: code }
        }),

    create: async (data) =>
        await db.insert(deweyCodes).values(data).returning(),

    update: async (code, data) =>
        await db.update(deweyCodes).set(data).where(eq(deweyCodes.code, code)).returning(),

    delete: async (code) =>
        await db.delete(deweyCodes).where(eq(deweyCodes.code, code)).returning()
}