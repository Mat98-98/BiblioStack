import { db } from "../db/connection.js";
import { notifications } from "../db/schema.js";
import { and, eq, isNull, sql } from "drizzle-orm";


export const notificationRepository = {
    findById: async (id) =>
        await db.query.notifications.findFirst({
            where: { id: id }
        }),

    create: async (data, tx = db) =>
        await tx.insert(notifications).values(data).returning(),

    createDeduped: async (data, tx = db) =>
        await tx
            .insert(notifications)
            .values(data)
            .onConflictDoNothing({
                target: notifications.dedupeKey,
                targetWhere: sql`${notifications.dedupeKey} IS NOT NULL`
            }).returning(),

    markAsRead: async (id, readAt) =>
        await db
            .update(notifications)
            .set({ readAt: readAt})
            .where(and(eq(notifications.id, id), isNull(notifications.readAt))).returning(),

    deleteAllByUserId: async (userId, tx = db) =>
        await tx.delete(notifications).where(eq(notifications.userId, userId))
};