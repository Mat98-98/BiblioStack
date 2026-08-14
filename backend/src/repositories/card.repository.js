import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const cardRepository = {
    getCardVersion: async (userId) =>
        await db.query.users.findFirst({
            where: { id: userId },
            columns: { id: true, cardVersion: true }
        }),

    incrementCardVersion: async (userId) => {
        const [updated] = await db
            .update(users)
            .set({ cardVersion: sql`${users.cardVersion} + 1` })
            .where(eq(users.id, userId))
            .returning({ id: users.id, cardVersion: users.cardVersion });

        return updated;
    }
};