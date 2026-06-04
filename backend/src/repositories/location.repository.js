import { db } from "../db/connection.js"
import { locations } from "../db/schema.js";
import {eq} from "drizzle-orm";

export const locationRepository = {
    findAll: async ({ page, limit }) => {
        const offset = limit * (page - 1);

        return await db.query.locations.findMany({
            limit: limit,
            offset: offset,
            with: {
                school: true
            }
        })
    },

    findById: async (id) =>
        await db.query.locations.findFirst({
            where: {id: id},
            with: {
                school: {
                    with: {
                        city: true
                    }
                }
            }
        }),

    create: async (data) =>
        await db.insert(locations).values(data).returning(),

    update: async (id, data) =>
        await db
            .update(locations)
            .set(data)
            .where(eq(locations.id, id))
            .returning(),

    delete: async (id) =>
        await db
            .delete(locations)
            .where(eq(locations.id, id))
            .returning()
}
