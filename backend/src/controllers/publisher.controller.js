import { publisherService } from "../services/publisher.service.js";
import { PublisherBaseDTO, PublisherBaseListDTO } from "../dto/publisher.dto.js";
import { UpdatePublisherSchema } from "../schemas/publisher.schema.js";

export const publisherController = {
    getAll: async (req, res, next) => {
        try {
            const publishers = await publisherService.getAll(req.pagination);
            const data = PublisherBaseListDTO.parse(publishers);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const publisher = await publisherService.getById(req.params.id);
            res.json(PublisherBaseDTO.parse(publisher));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = await CreatePublisherSchema.parse(req.body);
            const newPublisher = await publisherService.create(validatedData);
            res.status(200).json(newPublisher);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = await UpdatePublisherSchema.parse(req.body);
            const updatedPublisher = await publisherService.update(req.params.id, validatedData);
            res.json(updatedPublisher);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await publisherService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}