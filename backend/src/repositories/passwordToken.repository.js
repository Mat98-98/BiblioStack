import { db } from "../db/connection.js";
import { passwordTokens } from "../db/schema.js";
import { and, eq, isNull } from "drizzle-orm"

export const passwordTokenRepository = {

    findByToken: async (token) => {
        return await db.query.passwordTokens.findFirst({
            where: { token: token },
            with: { user: true }
        });
    },

    create: async (data) =>
        await db.insert(passwordTokens).values(data).returning(),

    findLatestByUserIdAndType: async (userId, type) =>
        await db.query.passwordTokens.findFirst({
            where: {
                userId: userId,
                type: type},
            orderBy: { createdAt: "desc" }
        }),

    markAsUsed: async (token, tx = db) =>
        await tx.update(passwordTokens).set({ usedAt: new Date() }).where(eq(passwordTokens.token, token)).returning(),

    invalidateAllByUserId: async (userId, tx = db) => {
        await tx.update(passwordTokens)
            .set({ usedAt: new Date() })
            .where(and(eq(passwordTokens.userId, userId), isNull(passwordTokens.usedAt)))
            .returning();
    }
}