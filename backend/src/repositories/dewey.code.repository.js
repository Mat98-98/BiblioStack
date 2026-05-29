import { db } from "../db/connection.js";
import { deweyCodes } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const deweyCodeRepository = {
    findAll: ({page, limit}) => {
        // Calcolo offset per la paginazione SQL
        const offset = (page - 1) * limit;

        return db.query.deweyCodes.findMany({
            limit: limit,
            offset: offset,
            orderBy: { code: "asc" }
        });
    },

    findByCode: (code) =>
        db.query.deweyCodes.findFirst({
            where: { code: code }
        }),

    create: (data) =>
        db.insert(deweyCodes).values(data).returning(),

    update: (code, data) =>
        db.update(deweyCodes).set(data).where(eq(deweyCodes.code, code)).returning(),

    delete: (code) =>
        db.delete(deweyCodes).where(eq(deweyCodes.code, code)).returning()
}