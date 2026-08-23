import { db } from "../db/connection.js";
import { refreshTokens } from "../db/schema.js";
import { eq, and, isNull } from "drizzle-orm";

export const refreshTokenRepository = {

    findValidByTokenHash: async (tokenHash, tx = db) =>
        await tx.query.refreshTokens.findFirst({
            where: { tokenHash }
        }),

    create: async ({ userId, tokenHash, expiresAt }, tx = db) => {
        const [record] = await tx.insert(refreshTokens).values({
            userId,
            tokenHash,
            expiresAt
        }).returning();
        return record;
    },

    revoke: async (id, replacedByTokenHash = null, tx = db) =>
        await tx.update(refreshTokens)
            .set({
                revokedAt: new Date(),
                ...(replacedByTokenHash && { replacedByTokenHash })
            })
            .where(eq(refreshTokens.id, id))
            .returning(),

    // Usato dal soft-delete e da "disconnetti tutti i dispositivi"
    revokeAllByUserId: async (userId, tx = db) =>
        await tx.update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)))
            .returning(),
};