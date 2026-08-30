import { noticeRepository } from "../repositories/notice.repository.js";
import { AppError } from "../utils/appError.js";
import {loanRepository} from "../repositories/loan.repository.js";

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

    create: async (data, operatorId) => {
        // Verifico che il prestito da associare alla segnalazione utente esista
        const loan = await loanRepository.findById(data.loanId);
        if (!loan) {
            throw new AppError("Loan not found", "NOT_FOUND", 404);
        }

        const secureData = {
            loanId: data.loanId,
            noticeTypeId: data.noticeTypeId,
            description: data.description,
            userId: loan.userId,
            handledBy: operatorId,
            issuedAt: new Date()
        };

        const [notice] = await noticeRepository.create(secureData);
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