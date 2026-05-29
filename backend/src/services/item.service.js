import { itemRepository } from "../repositories/item.repository.js";
import { AppError } from "../utils/appError.js";

const findUniqueOrThrow = async (id) => {
    const item = await itemRepository.findById(id);
    if (!item) throw new AppError("Item not found", "NOT_FOUND", 404);
    return item;
};

export const itemService = {

    getAll: ({ page, limit }) =>
        itemRepository.findAll({ page, limit }),

    getById: (id) =>
        findUniqueOrThrow(id),

    create: async (data) => {
        const [item] = await itemRepository.create(data);
        return item;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        // Bug fix: era itemRepository.update((id), data) — le parentesi extra intorno a id non causano errori
        // ma erano probabilmente un refuso; rimosso anche il Number() ridondante nel delete
        const [updatedItem] = await itemRepository.update(id, data);
        return updatedItem;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await itemRepository.delete(id);
        return { message: "Item has been successfully deleted" };
    },

    // @todo da cancellare, solo per debug
    getAvailable: async (workId) => {
        return await itemRepository.findAvailableByWorkId(workId);
    },
};