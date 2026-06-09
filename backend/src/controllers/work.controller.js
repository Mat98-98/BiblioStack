import { workService } from "../services/work.service.js";
import { WorkBaseListDTO, WorkDetailDTO, WorkSearchResultListDTO } from "../dto/work.dto.js";
import { CreateWorkSchema, UpdateWorkSchema, WorkSearchSchema } from "../schemas/work.schema.js";
import { CreateWorkFromExternalSchema } from "../schemas/work.schema.js";

export const workController = {

    getAll: async (req, res, next) => {
        try {
            const works = await workService.getAll(req.pagination);
            const data = WorkBaseListDTO.parse(works);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const work = await workService.getById(req.params.id);
            res.json(WorkDetailDTO.parse(work));
        } catch (error) {
            next(error);
        }
    },

    getNewest: async (req, res, next) => {
        try {
            // Prendo il parametro passato nell'url e impongo che sia un numero, altrimenti assegno 10
            const limit = Number(req.query.limit) || 10;

            const works = await workService.getNewest(limit)
            const data = WorkBaseListDTO.parse(works);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getMostLoaned: async (req, res, next) => {
        try {
            // Prendo il parametro passato nell'url e impongo che sia un numero, altrimenti assegno 10
            const limit = Number(req.query.limit) || 10;

            const works = await workService.getMostLoaned(limit)
            const data = WorkBaseListDTO.parse(works);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    search: async (req, res, next) => {
        try {
            const params = WorkSearchSchema.parse(req.query);
            const results = await workService.search(params);
            res.json(WorkSearchResultListDTO.parse(results));
        } catch (error) {
            next(error);
        }
    },

    createFromExternal: async (req, res, next) => {
        try {
            const validatedData = CreateWorkFromExternalSchema.parse(req.body);
            const newWork = await workService.createFromExternal(validatedData);
            res.status(201).json(WorkDetailDTO.parse(newWork));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateWorkSchema.parse(req.body);
            const newWork = await workService.create(validatedData);
            res.status(201).json(newWork);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateWorkSchema.parse(req.body);
            const updatedWork = await workService.update(req.params.id, validatedData);
            res.json(updatedWork);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await workService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}