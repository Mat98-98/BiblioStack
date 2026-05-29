import { db } from "../db/connection.js";
import { items, loans, reservations } from "../db/schema.js";
import { eq, isNull, and, notExists, sql } from "drizzle-orm";

export const itemRepository = {

    findAll: ({ page, limit }) => {
        const offset = limit * (page - 1);
        return db.query.items.findMany({
            limit,
            offset,
            columns: { price: false },
            with: { work: true }
        });
    },

    findById: (id) =>
        db.query.items.findFirst({
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

    findAvailableByWorkId: (workId) =>
        db.query.items.findFirst({
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



    create: (data) =>
        db.insert(items).values(data).returning(),

    update: (id, data) =>
        db.update(items).set(data).where(eq(items.id, id)).returning(),

    delete: (id) =>
        db.delete(items).where(eq(items.id, id)).returning(),
};