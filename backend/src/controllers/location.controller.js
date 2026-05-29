import { locationService } from "../services/location.service.js";
import { LocationBaseListDTO, LocationDetailDTO } from "../dto/location.dto.js";
import { CreateLocationSchema, UpdateLocationSchema } from "../schemas/location.schema.js";

export const locationController = {
    getAll: async (req, res, next) => {
        try {
            const locations = await locationService.getAll(req.pagination);
            const data = LocationBaseListDTO.parse(locations);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const location = await locationService.getById(req.params.id);
            res.json(LocationDetailDTO.parse(location));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = await CreateLocationSchema.parse(req.body);
             const newLocation = await locationService.create(validatedData);
             res.status(200).json(newLocation);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = await UpdateLocationSchema.parse(req.body);
            const updatedLocation = await locationService.update(req.params.id, validatedData);
            res.json(updatedLocation);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await locationService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}