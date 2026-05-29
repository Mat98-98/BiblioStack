import { authorRepository } from "../repositories/author.repository.js";
import { AppError } from "../utils/appError.js";


// Funzione per verificare l'esistenza di un autore, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const author = await authorRepository.findById(id);

    if (!author) {
        throw new AppError(
            "Author not found",
            "NOT_FOUND",
            404
        );
    }

    return author;
};


export const authorService = {

    getAll: async ({ page, limit }) => {
        return await authorRepository.findAll({ page, limit });
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    getByName: async (name) => {
        if (!name) throw new AppError("Name query parameter is required", "MISSING_QUERY_PARAM", 400);

        const authors = await authorRepository.findByName(name);

        if (authors.lenght === 0) throw new AppError("Author not found", "NOT_FOUND", 404);

        return authors;
    },

    create: async (data) => {
        const[newAuthor] = await authorRepository.create({
            firstName: data.firstName?.trim(),
            lastName: data.lastName?.trim()
        });
        return newAuthor;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);

        const [updatedAuthor] = await authorRepository.update(id, {
            firstName: data.firstName?.trim(),
            lastName: data.lastName?.trim()
        });
        return updatedAuthor;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await authorRepository.delete(id);

        return { message: "Author successfully deleted" };
    }
}