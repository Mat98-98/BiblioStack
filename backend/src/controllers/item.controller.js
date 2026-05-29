import { itemService } from "../services/item.service.js";
import { ItemBaseListDTO } from "../dto/item.dto.js";

export const itemController = {

    getAll: async (req, res, next) => {
        try {
            const items = await itemService.getAll(req.pagination);
            const data = ItemBaseListDTO.parse(items);
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req, res, next) => {
        try {
            const item = await itemService.getById(req.params.id);
            res.json(item);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const newItem = await itemService.create(req.body);
            res.status(201).json(newItem);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const updatedItem = await itemService.update(
                req.params.id,
                req.body
            );
            res.json(updatedItem);
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await itemService.delete(req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    //@Todo da cancellare
    getAvailable: async (req, res, next) => {
        try {
            const item = await itemService.getAvailable(req.params.workId);
            res.json(item);
        } catch (err) {
            next(err);
        }
    }
};