import { notices } from "../db/schema.js";
import { db } from "../db/connection.js";
import {eq} from "drizzle-orm";

export const noticeRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione SQL
        const offset = (page - 1) * limit;

        return await db.query.notices.findMany({
            limit: limit,
            offset: offset,
            with: {
                loan: true,
                user: true,
                type: true,
            },
            orderBy: { issuedAt: { desc: "desc" } }
        });
    },

    findById: async (id) =>
        await db.query.notices.findFirst({
            where: {id: id},
            with: {
                loan: true,
                user: true,
                handler: true,
                type: true
            }
        }),

    create: async (data) =>
        await db.insert(notices).values(data).returning(),

    update: async (id, data) =>
        await db
            .update(notices)
            .set(data)
            .where(eq(notices.id, id))
            .returning(),

    delete: async (id) =>
        await db
            .delete(notices)
            .where(eq(notices.id, id))
            .returning()
}