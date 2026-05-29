import { db } from "../db/connection.js"
import { locations } from "../db/schema.js";
import {eq} from "drizzle-orm";

export const locationRepository = {
    findAll: ({ page, limit }) => {
        const offset = limit * (page - 1);

        return db.query.locations.findMany({
            limit: limit,
            offset: offset,
            with: {
                school: true
            }
        })
    },

    findById: (id) =>
        db.query.locations.findFirst({
            where: {id: id},
            with: {
                school: {
                    with: {
                        city: true
                    }
                }
            }
        }),

    create: (data) =>
        db.insert(locations).values(data).returning(),

    update: (id, data) =>
        db
            .update(locations)
            .set(data)
            .where(eq(locations.id, id))
            .returning(),

    delete: (id) =>
        db
            .delete(locations)
            .where(eq(locations.id, id))
            .returning()
}
