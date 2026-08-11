import { AppError } from "../utils/appError.js";
import { currencyRepository } from "../repositories/currency.repository.js";


// Funzione per verificare l'esistenza di una valuta, usata in getByCode
const findUniqueOrThrow = async (code) => {
    const currency = await currencyRepository.findByCode(code);

    if (!currency) {
        throw new AppError(
            "Currency not found",
            "NOT_FOUND",
            404
        );
    }
    return currency;
};

export const currencyService = {
    getAll: async ({ page, limit }) => {
        return await currencyRepository.findAll({ page, limit });
    },

    getByCode: async (code) => {
        return await findUniqueOrThrow(code);
    },

}