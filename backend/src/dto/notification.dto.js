import { z } from 'zod';

export const NotificationDTO = z.object({
    id: z.number().int(),
    title: z.string().min(1).max(64),
    message: z.string().min(1).max(255),
    createdAt: z.date(),
    readAt: z.date().nullable(),
});

export const NotificationListDTO = z.array(NotificationDTO);