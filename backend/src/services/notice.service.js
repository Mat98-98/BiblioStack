import { noticeRepository } from "../repositories/notice.repository.js";
import { AppError } from "../utils/appError.js";

// Funzione per verificare l'esistenza di una segnalazione, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const notice = await noticeRepository.findById(id);

    if (!notice) {
        throw new AppError(
            "Notice not found",
            "NOT_FOUND",
            404
        );
    }

    return notice;
};

// Service
export const noticeService = {
    getAll: async ({ page, limit }) => {
        return  await noticeRepository.findAll({page, limit});
    },

    getById: async (id) => {
        return  await findUniqueOrThrow(id);
    },

    create: async (data) => {
        const [notice] = await noticeRepository.create(data);
        return notice;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedNotice] = await noticeRepository.update(id, data);

        return updatedNotice;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await noticeRepository.delete(id);

        return { message: "Notice has been successfully deleted" };
    }

}