import { db } from "../db/connection.js";
import { passwordTokens } from "../db/schema.js";
import { eq } from "drizzle-orm"

export const passwordTokenRepository = {

    findByToken: async (token) => {
        return await db.query.passwordTokens.findFirst({
            where: { token: token },
            with: { user: true }
        });
    },

    create: async (data) =>
        await db.insert(passwordTokens).values(data).returning(),

    markAsUsed: async (token) =>
        await db.update(passwordTokens).set({ usedAt: new Date() }).where(eq(passwordTokens.token, token)).returning(),

    findLatestByUserIdAndType: async (userId, type) =>
        await db.query.passwordTokens.findFirst({
            where: {
                userId: userId,
                type: type,},
            orderBy: { createdAt: "desc" }
        })
}