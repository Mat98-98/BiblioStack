import { authorService } from "../services/author.service.js";
import { AuthorBaseListDTO, AuthorDetailDTO } from "../dto/author.dto.js";
import { CreateAuthorSchema, UpdateAuthorSchema } from "../schemas/author.schema.js";

export const authorController = {

    getAll: async (req, res, next) => {
        try {
            const authors = await authorService.getAll(req.pagination);
            const data = AuthorBaseListDTO.parse(authors);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const author = await authorService.getById(req.params.id);
            res.json(AuthorDetailDTO.parse(author));
        } catch (error) {
            next(error);
        }
    },

    // @todo Applicare la stessa logica di paginazione usata in users
    getByName: async (req, res, next) => {
        try {
            const { name } = req.query;
            const authors = await authorService.getByName(name);
            res.json(authors);
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const data = CreateAuthorSchema.parse(req.body);
            const author = await authorService.create(data);
            res.status(201).json(author);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const data = UpdateAuthorSchema.parse(req.body);
            const author = await authorService.update(req.params.id, data);
            res.status(200).json(author);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = authorService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}