import { notificationRepository } from "../repositories/notification.repository.js";
import { AppError } from "../utils/appError.js";

const findUniqueOrThrow = async (id) => {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
        throw new AppError("Notification not found", "NOT_FOUND", 404);
    }
    return notification;
}

export const notificationService = {
    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    create: async (data) => {
        const [newNotification] = await notificationRepository.create(data);
        return newNotification;
    },

    markAsRead: async (id, requestingUser) => {
        // Controllo che la notifica esista
        const notification = await findUniqueOrThrow(id);

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