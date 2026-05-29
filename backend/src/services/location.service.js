import {locationRepository} from "../repositories/location.repository.js";
import { AppError } from "../utils/appError.js";

// Funzione per verificare l'esistenza di una locazione, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const location = await locationRepository.findById(id);

    if (!location) {
        throw new AppError(
            "Location not found",
            "NOT_FOUND",
            404
        );
    }

    return location;
};

// Service
export const locationService = {
    getAll: async ({ page, limit }) => {
        return await locationRepository.findAll({ page, limit });
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    create: async (data) => {
        const [newLocation] = await locationRepository.create(data);
        return newLocation;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedLocation] = await locationRepository.update(id, data);

        return updatedLocation;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await locationRepository.delete(id);

        return { message: "Location has been successfully deleted" };
    }
}