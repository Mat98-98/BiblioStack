import { publicationCountriesRepository } from "../repositories/publication.countries.repository.js";
import {AppError} from "../utils/appError.js";


// Funzione per verificare l'esistenza di un paese di pubblicazione, usata in getByCountryCode
const findUniqueOrThrow = async (countryCode) => {
    const publicationCountry = await publicationCountriesRepository.findByCountryCode(countryCode);

    if (!publicationCountry) {
        throw new AppError(
            "Language not found",
            "NOT_FOUND",
            404
        );
    }

    return publicationCountry;
};

export const publicationCountriesService = {
    getAll: async ({page, limit}) => {
        return await publicationCountriesRepository.findAll({page, limit});
    },

    getByCountryCode: async (countryCode) => {
        return await findUniqueOrThrow(countryCode);
    }
}