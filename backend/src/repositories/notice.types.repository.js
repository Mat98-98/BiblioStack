import { db } from "../db/connection.js";
import { noticeTypes } from "../db/schema.js";


export const noticeTypesRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return await db.query.noticeTypes.findMany({
            limit : limit,
            offset: offset
        });
    },

    findById: async (id) =>
        await db.query.noticeTypes.findFirst({
            where: { id: id }
        }),
};