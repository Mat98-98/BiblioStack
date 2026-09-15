import { db } from "../db/connection.js";
import { notifications } from "../db/schema.js";
import {and, eq, isNotNull, isNull, gte, or, desc} from "drizzle-orm";
import {logger} from "../config/logger.config.js";


export const notificationRepository = {
    findById: async (id, userId) =>
        await db.query.notifications.findFirst({
            where: {
                id: id,
                userId: userId // Cerco anche per userId in modo che solo il proprietario possa vedere la notifica
            }
        }),

    findByUserId: async (userId, { page, limit }) =>
        await db.query.notifications.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            limit: limit,
            offset: (page - 1) * limit
        }),

    findPreview: async (userId, firstNotificationDate) =>
        await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, userId),
                    or(
                        isNull(notifications.readAt),
                        gte(notifications.readAt, firstNotificationDate)
                    )
                )
            )
            .orderBy(desc(notifications.createdAt)),

    countByUserId: async (userId) =>
        await db.$count(notifications, eq(notifications.userId, userId)),

    create: async (data, tx = db) =>
        await tx.insert(notifications).values(data).returning(),

    createDeduped: async (data, tx = db) =>
        await tx
            .insert(notifications)
            .values(data)
            .onConflictDoNothing({
                target: notifications.dedupeKey,
                where: isNotNull(notifications.dedupeKey)
            }).returning(),

    // Solo il proprietario può contrassegnare come letta la notifica
    markAsRead: async (id, userId, readAt) =>
        await db
            .update(notifications)
            .set({ readAt: readAt})
            .where(and(
                eq(notifications.id, id),
                eq(notifications.userId, userId),
                isNull(notifications.readAt))).returning(),

    deleteAllByUserId: async (userId, tx = db) =>
        await tx.delete(notifications).where(eq(notifications.userId, userId))
};