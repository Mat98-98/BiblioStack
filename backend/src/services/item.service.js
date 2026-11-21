import { itemRepository } from "../repositories/item.repository.js";
import { AppError } from "../utils/appError.js";
import {getConstraint, isForeignKeyViolation} from "../utils/db.util.js";

const findUniqueOrThrow = async (id) => {
    const item = await itemRepository.findById(id);
    if (!item) throw new AppError("Item not found", "NOT_FOUND", 404);
    return item;
};

export const itemService = {

    getAll: async ({ page, limit }) =>
        await itemRepository.findAll({ page, limit }),

    getById: async (id) =>
        await findUniqueOrThrow(id),

    create: async (data) => {
        const [item] = await itemRepository.create(data);
        return item;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedItem] = await itemRepository.update(id, data);
        return updatedItem;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);

        try {
            await itemRepository.delete(id);
        } catch (error) {
            // Faccio il catch dell'eccezione generata dal db o da drizzle per violazione di integrità referenziale
            if (
                isForeignKeyViolation(error) &&
                getConstraint(error) === "loans_item_id_fkey"
            ) {
                throw new AppError(
                    "Cannot delete item because it has dependencies",
                    "ITEM_HAS_DIPENDENCIES",
                    409
                );
            }
            throw error;
        }
        return { message: "Item has been successfully deleted" };
    }
};