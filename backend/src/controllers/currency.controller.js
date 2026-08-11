import { currencyService } from "../services/currency.service.js";


export const currencyController = {
    getAll: async (req, res, next) => {
        try {
            const currencies = await currencyService.getAll(req.pagination);
            res.json(currencies);
        } catch (error) {
            next(error);
        }
    },

    getByCode: async (req, res, next) => {
        try {
            const currency = await currencyService.getByCode(req.params.id);
            res.json(currency);
        } catch (error) {
            next(error);
        }
    }
};