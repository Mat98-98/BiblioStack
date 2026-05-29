import { AppError } from "../utils/appError.js";
import { genreRepository } from "../repositories/genre.repository.js";


// Funzione per verificare l'esistenza di un tipo di contributo, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const genre = await genreRepository.findById(id);

    if (!genre) {
        throw new AppError(
            "Genre not found",
            "NOT_FOUND",
            404
        );
    }

    return genre;
};

export const genreService = {
    getAll: async ({ page, limit }) => {
        return await genreRepository.findAll({ page, limit });
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    create: async (data) => {
        const [newGenre] = await genreRepository.create(data);
        return newGenre;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedGenre] = await genreRepository.update(id, data);

        return updatedGenre;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await genreRepository.delete(id);

        return { message: "Genre has been successfully deleted" };
    }
}