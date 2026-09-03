import { db } from "../db/connection.js";
import { suspensions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {userSelect} from "./presets/user.preset.js";

export const suspensionRepository = {
    findAll: async ({ page, limit }) => {
        const offset = limit * (page - 1);

        return await db.query.suspensions.findMany({
            limit: limit,
            offset: offset,
            with: {
                user: userSelect.safe,
                handler: false
            }
        })
    },

    findById: async (id, tx = db) =>
        await tx.query.suspensions.findFirst({
            where: {
                id: id
            },
            with: {
                user: userSelect.safe,
                handler: userSelect.safe
            }
        }),

    // Il parametro tx permette di eseguire la query all'interno di una transazione (come quella per il soft delete in user service), se non viene passato usa la connessione normale db come fallback.
    findActiveByUserId: async (userId, tx = db) =>
        await tx.query.activeSuspensions.findFirst({
            where: { userId: userId }
        }),

    endById: async (id, tx = db) =>
        await tx
            .update(suspensions)
            .set({ endDate: new Date() })
            .where(eq(suspensions.id, id))
            .returning(),

    create: async (data, tx = db) =>
        await tx
            .insert(suspensions)
            .values(data)
            .returning(),

    update: async (id, data, tx = db) =>
        await tx
            .update(suspensions)
            .set(data)
            .where(eq(suspensions.id, id))
            .returning(),

    delete: async (id, tx = db) =>
        await tx
            .delete(suspensions)
            .where(eq(suspensions.id, id))
            .returning()

}