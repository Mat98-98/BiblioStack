import { notificationService } from "../services/notification.service.js";
import { NotificationDTO } from "../dto/notification.dto.js";
import {MarkNotificationAsReadSchema} from "../schemas/notification.schema.js";

export const notificationController = {
    getById: async (req, res, next) => {
        try {
            const notification = await notificationService.getById(req.params.id);
            res.json(NotificationDTO.parse(notification));
        } catch (error) {
            next(error);
        }
    },

    markAsRead: async (req, res, next) => {
        try {
            const { id } = MarkNotificationAsReadSchema.parse(req.params);
            const updatedNotification = await notificationService.markAsRead(id, req.user);
            res.json(updatedNotification);
        } catch (error) {
            next(error);
        }
    }
}