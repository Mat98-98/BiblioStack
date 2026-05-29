import { db } from "../db/connection.js";
import { suspensions } from "../db/schema.js";
import {eq} from "drizzle-orm";

export const suspensionRepository = {
    findAll: ({ page, limit }) => {
        const offset = limit * (page - 1);

        return db.query.suspensions.findMany({
            limit: limit,
            offset: offset,
            with: {
                user: true,
                handler: false
            }
        })
    },

    findById: (id) =>
        db.query.suspensions.findFirst({
            where: {
                id: id
            },
            with: {
                user: true,
                handler: true
            }
        }),

    create: (data) =>
        db
            .insert(suspensions)
            .values(data)
            .returning(),

    update: (id, data) =>
        db
            .update(suspensions)
            .set(data)
            .where(eq(suspensions.id, id))
            .returning(),

    delete: (id) =>
        db
            .delete(suspensions)
            .where(eq(suspensions.id, id))
            .returning

}