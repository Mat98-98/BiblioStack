import { notices } from "../db/schema.js";
import { db } from "../db/connection.js";
import {eq} from "drizzle-orm";

export const noticeRepository = {
    findAll: ({ page, limit }) => {
        // Calcolo offset per la paginazione SQL
        const offset = (page - 1) * limit;

        return db.query.notices.findMany({
            limit: limit,
            offset: offset,
            with: {
                loan: true,
                user: true,
                type: true,
            },
            orderBy: { issuedAt: { desc: "desc" } }
        });
    },

    findById: (id) =>
        db.query.notices.findFirst({
            where: {id: id},
            with: {
                loan: true,
                user: true,
                handler: true,
                type: true
            }
        }),

    create: (data) =>
        db.insert(notices).values(data).returning(),

    update: (id, data) =>
        db
            .update(notices)
            .set(data)
            .where(eq(notices.id, id))
            .returning(),

    delete: (id) =>
        db
            .delete(notices)
            .where(eq(notices.id, id))
            .returning()
}