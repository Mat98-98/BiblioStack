import { notificationRepository } from "../repositories/notification.repository.js";
import { AppError } from "../utils/appError.js";
import {db} from "../db/connection.js";

const findUniqueOrThrow = async (id, userId) => {
    const notification = await notificationRepository.findById(id, userId);

    if (!notification) {
        throw new AppError("Notification not found", "NOT_FOUND", 404);
    }
    return notification;
}

export const notificationService = {
    getById: async (id, user) => {
        const numericId = Number(id);
        // Valido l'id notifica
        if (!Number.isInteger(numericId)) {
            throw new AppError("Invalid notification id", "VALIDATION_ERROR", 400);
        }
        return await findUniqueOrThrow(numericId, user.id);
    },

    getByUserId: async (user, { page, limit }) => {
        const [data, total] = await Promise.all([
            notificationRepository.findByUserId(user.id, { page, limit }),
            notificationRepository.countByUserId(user.id)
        ]);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit))
            }
        };
    },

    getPreview: async (user) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return await notificationRepository.findPreview(user.id, oneWeekAgo);
    },

    create: async (data, tx = db) => {
        const [newNotification] = await notificationRepository.create(data, tx);
        return newNotification;
    },

    createDeduped: async (data, tx = db) => {
        const [newNotification] = await notificationRepository.createDeduped(data, tx);
        return newNotification ?? null;
    },

    markAsRead: async (id, requestingUser) => {
        // Controllo che la notifica esista
        const notification = await findUniqueOrThrow(id, requestingUser.id);

        // Verifico che il richiedente sia l'utente che ha ricevuto la notifica
        const isOwner = notification.userId === requestingUser.id;
        if (!isOwner) {
            throw new AppError("Forbidden", "FORBIDDEN", 403);
        }

        // Superati i controlli la marco come letta
        const now = new Date();
        const [updatedNotification] = await notificationRepository.markAsRead(id, now);

        return updatedNotification;
    }
}