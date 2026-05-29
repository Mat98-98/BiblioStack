import { contributionService } from "../services/contribution.service.js";
import { ContributionBaseDto, ContributionBaseListDTO } from "../dto/contribution.dto.js";
import { CreateContributionSchema, UpdateContributionSchema } from "../schemas/contribution.schema.js";

export const contributionController = {
    getAll: async (req, res, next) => {
        try {
            const contributions = await contributionService.getAll(req.pagination);
            const data = ContributionBaseListDTO.parse(contributions);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const contribution = await contributionService.getById(req.params.id);
            res.json(ContributionBaseDto.parse(contribution));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateContributionSchema.parse(req.body);

            const newContribution = await contributionService.create(validatedData);

            res.status(200).json(ContributionBaseDto.parse(newContribution));
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateContributionSchema.parse(req.body);

            const updatedContribution = await contributionService.update(req.params.id, validatedData);

            res.json(ContributionBaseDto.parse(updatedContribution));
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await contributionService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};