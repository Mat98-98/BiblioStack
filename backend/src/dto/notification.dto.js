import { z } from 'zod';

export const NotificationDTO = z.object({
    id: z.number().int(),
    title: z.string().min(1).max(64),
    message: z.string().min(1).max(255),
    createdAt: z.date(),
    readAt: z.date().nullable(),
});

export const NotificationListDTO = z.array(NotificationDTO);

export const PaginatedNotificationListDTO = z.object({
    data: NotificationListDTO,
    meta: z.object({
        page: z.number().int(),
        limit: z.number().int(),
        total: z.number().int(),
        totalPages: z.number().int(),
    })
});