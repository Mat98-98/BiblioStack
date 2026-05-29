import { suspensionService } from "../services/suspension.service.js";
import { SuspensionBaseListDTO, SuspensionDetailDTO } from "../dto/suspension.dto.js";
import { CreateSuspensionSchema, UpdateSuspensionSchema } from "../schemas/suspension.schema.js";

export const suspensionController = {
    getAll: async (req, res, next) => {
        try {
            const suspensions = await suspensionService.getAll(req.pagination);
            const data = SuspensionBaseListDTO.parse(suspensions);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const suspension = await suspensionService.getById(req.params.id);
            res.json(SuspensionDetailDTO.parse(suspension));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateSuspensionSchema.parse(req.body);
            const newSuspension = await suspensionService.create(validatedData);
            res.status(200).json(newSuspension);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateSuspensionSchema.parse(req.body);
            const updatedSuspension = await suspensionService.update(validatedData);
            res.json(updatedSuspension);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await suspensionService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
