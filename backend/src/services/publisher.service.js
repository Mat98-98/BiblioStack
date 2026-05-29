import { publisherRepository } from "../repositories/publisher.repository.js";
import { AppError } from "../utils/appError.js";

// Funzione per verificare l'esistenza di una casa editrice, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const publisher = await publisherRepository.findById(id);

    if (!publisher) {
        throw new AppError(
            "Location not found",
            "NOT_FOUND",
            404
        );
    }

    return publisher;
};

// Service
export const publisherService = {
    getAll: async ({ page, limit }) => {
        return await publisherRepository.findAll({ page, limit });
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    create: async (data) => {
        const [newPublisher] = await publisherRepository.create(data);
        return newPublisher;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedPublisher] = await publisherRepository.update(id, data);

        return updatedPublisher;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await publisherRepository.delete(id);

        return { message: "Publisher has been successfully deleted" };
    }
}