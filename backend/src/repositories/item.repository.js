import { db } from "../db/connection.js";
import { items, loans, reservations } from "../db/schema.js";
import { eq, isNull, and, notExists, sql } from "drizzle-orm";

export const itemRepository = {

    findAll: async ({ page, limit }) => {
        const offset = limit * (page - 1);
        return await db.query.items.findMany({
            limit,
            offset,
            columns: { price: false },
            with: { work: true }
        });
    },

    findById: async (id) =>
        await db.query.items.findFirst({
            where: { id },
            with: {
                work: true,
                location: {
                    with: { school: true }
                },
                loans: {
                    limit: 1,
                    orderBy: { loanDate: "desc" }
                }
            }
        }),

    findAvailableByWorkId: async (workId) =>
        await db.query.items.findFirst({
                where: {
                    workId,
                    RAW: (table) => sql`
                NOT EXISTS (
                    SELECT 1 FROM loans
                    WHERE loans.item_id = ${table.id}
                    AND loans.return_date IS NULL
                )
                AND NOT EXISTS (
                    SELECT 1 FROM reservations
                    WHERE reservations.assigned_item_id = ${table.id}
                    AND reservations.status = 'ready'
                )
                `
                },
                with: { work: true }
        }),



    create: async (data) =>
        await db.insert(items).values(data).returning(),

    update: async (id, data) =>
        await db.update(items).set(data).where(eq(items.id, id)).returning(),

    delete: async (id) =>
        await db.delete(items).where(eq(items.id, id)).returning(),
};