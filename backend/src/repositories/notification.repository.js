import { db } from "../db/connection.js";
import { notifications } from "../db/schema.js";
import { and, eq, isNull } from "drizzle-orm";


export const notificationRepository = {
    findById: async (id) =>
        await db.query.notifications.findFirst({
            where: { id: id }
        }),

    create: async (data, tx = db) =>
        await tx.insert(notifications).values(data).returning(),

    markAsRead: async (id, readAt) =>
        await db
            .update(notifications)
            .set({ readAt: readAt})
            .where(and(eq(notifications.id, id), isNull(notifications.readAt))).returning()
};