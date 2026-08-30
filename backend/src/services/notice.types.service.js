import { AppError } from "../utils/appError.js";
import { noticeTypesRepository } from "../repositories/notice.types.repository.js";

// Funzione per verificare l'esistenza di un tipo di segnalazione, usata in getById
const findUniqueOrThrow = async (id) => {
    const noticeType = await noticeTypesRepository.findById(id);

    if (!noticeType) {
        throw new AppError("Notice type not found.", "NOT_FOUND", 404);
    }
    return noticeType;
}

export const noticeTypesService = {
    getAll: async ({ page, limit }) => {
        return await noticeTypesRepository.findAll({page, limit});
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    }
}