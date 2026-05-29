import { languageService } from "../services/language.service.js";
import { LanguageBaseDTO, LanguageBaseListDTO } from "../dto/language.dto.js";
import { CreateLanguageSchema, UpdateLanguageSchema } from "../schemas/language.schema.js";

export const languageController = {
    getAll: async (req, res, next) => {
        try {
            const languages = await languageService.getAll(req.pagination);
            const data = LanguageBaseListDTO.parse(languages);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getByLanguageCode: async (req, res, next) => {
        try {
            const language = await languageService.getByLanguageCode(req.params.languageCode);
            res.json(LanguageBaseDTO.parse(language));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateLanguageSchema.parse(req.body);
            const newLanguage = await languageService.create(validatedData);
            res.status(200).json(LanguageBaseDTO.parse(newLanguage));
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateLanguageSchema.parse(req.body);

            const updatedLanguage = await languageService.update(req.params.languageCode, validatedData);

            res.json(LanguageBaseDTO.parse(updatedLanguage));
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await languageService.delete(req.params.languageCode);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}