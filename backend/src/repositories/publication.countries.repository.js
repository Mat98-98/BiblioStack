import { publicationCountries } from "../db/schema.js";
import { db } from "../db/connection.js";

export const publicationCountriesRepository = {
    findAll: async ({ page, limit }) => {
        // Calcolo offset per la paginazione SQL
        const offset = (page - 1) * limit;

        return await db.query.publicationCountries.findMany({
            limit: limit,
            offset: offset
        });
    },

    findByCountryCode: async (countryCode) =>
        await db.query.publicationCountries.findFirst({
            where: { countryCode }
        })
}