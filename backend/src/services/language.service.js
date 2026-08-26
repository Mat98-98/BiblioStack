import { AppError } from "../utils/appError.js";
import { languageRepository } from "../repositories/language.repository.js";


// Funzione per verificare l'esistenza di un tipo una lingua, usata in getByLanguageCode, update e delete
const findUniqueOrThrow = async (languageCode) => {
    const language = await languageRepository.findByLanguageCode(languageCode);

    if (!language) {
        throw new AppError(
            "Language not found",
            "NOT_FOUND",
            404
        );
    }

    return language;
};

export const languageService = {
    getAll: async ({ page, limit }) => {
        return await languageRepository.findAll({ page, limit });
    },

    getByLanguageCode: async (languageCode) => {
        return await findUniqueOrThrow(languageCode);
    },

    create: async (data) => {
        const [newLanguage] = await languageRepository.create(data);
        return newLanguage;
    },

    update: async (languageCode, data) => {
        await findUniqueOrThrow(languageCode);
        const [updatedLanguage] = await languageRepository.update(languageCode, data);

        return updatedLanguage;
    },

    delete: async (languageCode) => {
        await findUniqueOrThrow(languageCode);
        await languageRepository.delete(languageCode);

        return { message: "Language has been successfully deleted" };
    }
}