import { deweyCodeRepository } from "../repositories/dewey.code.repository.js";
import { AppError } from "../utils/appError.js";


// Funzione per verificare l'esistenza di un dewey code, usata in getByCode, update e delete
const findUniqueOrThrow = async (code) => {
    const deweyCode = await deweyCodeRepository.findByCode(code);

    if (!deweyCode) {
        throw new AppError(
            "Dewey code not found",
            "NOT_FOUND",
            404
        );
    }

    return deweyCode;
};

// Funzioni generali per recuperare i dati dal repository
export const deweyCodeService = {
    getAll: async ({page, limit}) => {
        return await deweyCodeRepository.findAll({page, limit});
    },

    getByCode: async (code) => {
        return await findUniqueOrThrow(code);
    },

    create: async (data) => {
        const [newDeweyCode] = await deweyCodeRepository.create(data);
        return newDeweyCode;
    },

    update: async (code, data) => {
        await findUniqueOrThrow(code);
        const [updatedDeweyCode] = await deweyCodeRepository.update(code, data);

        return updatedDeweyCode;
    },

    delete: async (code) => {
        await findUniqueOrThrow(code);
        await deweyCodeRepository.delete(code);

        return { message: "Dewey code has been successfully deleted" };
    }
};