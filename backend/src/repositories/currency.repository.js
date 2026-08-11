import { db } from "../db/connection.js";
import { currencies } from "../db/schema.js";


export const currencyRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione
        const offset = (page - 1) * limit;

        return await db.query.currencies.findMany({
            limit : limit,
            offset: offset
        });
    },

    findByCode: async (code) =>
        await db.query.currencies.findFirst({
            where: {code: code}
        }),
};