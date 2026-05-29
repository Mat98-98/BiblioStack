import { genreService } from "../services/genre.service.js";
import { GenreBaseDTO, GenreBaseListDTO } from "../dto/genre.dto.js";
import { CreateGenreSchema, UpdateGenreSchema } from "../schemas/genre.schema.js";

export const genreController = {
    getAll: async (req, res, next) => {
        try {
            const genres = await genreService.getAll(req.pagination);
            const data = GenreBaseListDTO.parse(genres);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const genre = await genreService.getById(req.params.id);
            res.json(GenreBaseDTO.parse(genre));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateGenreSchema.parse(req.body);
            const newGenre = await genreService.create(validatedData);
            res.status(200).json(GenreBaseDTO.parse(newGenre));
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateGenreSchema.parse(req.body);

            const updatedGenre = await genreService.update(req.params.id, validatedData);

            res.json(GenreBaseDTO.parse(updatedGenre));
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await genreService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}