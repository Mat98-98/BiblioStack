import { deweyCodeService } from "../services/dewey.code.service.js";
import { DeweyCodeBaseDTO, DeweyCodeBaseListDTO } from "../dto/dewey.code.dto.js";
import { CreateDeweySchema, UpdateDeweySchema } from "../schemas/dewey.schema.js";


export const deweyCodeController = {
    getAll: async (req, res, next) => {
        try {
            const deweyCodes = await deweyCodeService.getAll(req.pagination);
            const data = DeweyCodeBaseListDTO.parse(deweyCodes);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getByCode: async (req, res, next) => {
        try {
            const deweyCode = await deweyCodeService.getByCode(req.params.code);
            res.json(DeweyCodeBaseDTO.parse(deweyCode));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            //Validazione input
            const validatedData = CreateDeweySchema.parse(req.body);

            const newDeweyCode = await deweyCodeService.create(validatedData);

            res.status(201).json(DeweyCodeBaseDTO.parse(newDeweyCode));
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            // Validazione input
            const validatedData = UpdateDeweySchema.parse(req.body);

            const updatedDeweyCode = await deweyCodeService.update(req.params.code, validatedData);

            res.json(DeweyCodeBaseDTO.parse(updatedDeweyCode));
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await deweyCodeService.delete(req.params.code);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};