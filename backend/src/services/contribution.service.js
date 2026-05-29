import { AppError } from "../utils/appError.js";
import { contributionRepository } from "../repositories/contribution.repository.js";


// Funzione per verificare l'esistenza di un tipo di contributo, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const contribution = await contributionRepository.findById(id);

    if (!contribution) {
        throw new AppError(
            "Contribution type not found",
            "NOT_FOUND",
            404
        );
    }

    return contribution;
};

export const contributionService = {
    getAll: async ({ page, limit }) => {
        return await contributionRepository.findAll({ page, limit });
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    create: async (data) => {
        const [newContribution] = await contributionRepository.create(data);
        return newContribution;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedContribution] = await contributionRepository.update(id, data);

        return updatedContribution;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await contributionRepository.delete(id);

        return { message: "Contribution type has been successfully deleted" };
    }
}