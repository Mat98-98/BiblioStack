import { suspensionRepository } from "../repositories/suspension.repository.js";
import { AppError } from "../utils/appError.js";
import {suspensions} from "../db/schema.js";

// Funzione per verificare l'esistenza di una sospensione, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const suspension = await suspensionRepository.findById(id);

    if (!suspension) {
        throw new AppError(
            "Suspension not found",
            "NOT_FOUND",
            404
        );
    }

    return suspension;
};

// Service
export const suspensionService = {
    getAll: async ({ page, limit }) => {
        return await suspensionRepository.findAll({ page, limit })
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    endActiveByUserId: async (userId) => {
        // Cerco e ricavo la sospensione attiva dell'utente
        const active = await suspensionRepository.findActiveByUserId(userId);
        if (!active) {
            throw new AppError("No active suspension found for this user", "NOT_FOUND", 404);
        }

        // Se ne trovo una attiva procedo con il soft delete
        await suspensionRepository.endById(active.id);
        return await suspensionRepository.findById(active.id);
    },

    create: async (data) => {
        const [suspension] = await suspensionRepository.create(data);
        return suspension;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedSuspension] = await suspensionRepository.update(data);

        return updatedSuspension;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);

        await suspensionRepository.delete(id);
        return { message: "Suspension deleted successfully" };
    }
}