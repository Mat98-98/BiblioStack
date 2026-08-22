import { db } from "../db/connection.js";
import { suspensions } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const suspensionRepository = {
    findAll: async ({ page, limit }) => {
        const offset = limit * (page - 1);

        return await db.query.suspensions.findMany({
            limit: limit,
            offset: offset,
            with: {
                user: true,
                handler: false
            }
        })
    },

    findById: async (id) =>
        await db.query.suspensions.findFirst({
            where: {
                id: id
            },
            with: {
                user: true,
                handler: true
            }
        }),

    findActiveByUserId: async (userId) =>
        await db.query.activeSuspensions.findFirst({
            where: { userId: userId }
        }),

    endById: async (id) =>
        await db
            .update(suspensions)
            .set({ endDate: new Date() })
            .where(eq(suspensions.id, id))
            .returning(),

    create: async (data) =>
        await db
            .insert(suspensions)
            .values(data)
            .returning(),

    update: async (id, data) =>
        await db
            .update(suspensions)
            .set(data)
            .where(eq(suspensions.id, id))
            .returning(),

    delete: async (id) =>
        await db
            .delete(suspensions)
            .where(eq(suspensions.id, id))
            .returning()

}