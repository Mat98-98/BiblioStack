import { notificationService } from "../services/notification.service.js";
import { NotificationDTO, NotificationListDTO, PaginatedNotificationListDTO } from "../dto/notification.dto.js";
import { MarkNotificationAsReadSchema } from "../schemas/notification.schema.js";

export const notificationController = {
    getById: async (req, res, next) => {
        try {
            const notification = await notificationService.getById(req.params.id, req.user);
            res.json(NotificationDTO.parse(notification));
        } catch (error) {
            next(error);
        }
    },

    getList: async (req, res, next) => {
        try {
            const result = await notificationService.getList(req.user, req.pagination);
            res.json(PaginatedNotificationListDTO.parse(result));
        } catch (error) {
            next(error);
        }
    },

    getPreview: async (req, res, next) => {
        try {
            const notifications = await notificationService.getPreview(req.user);
            res.json(NotificationListDTO.parse(notifications));
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