import { notificationService } from "../../services/notification.service.js";
import { notificationTemplates } from "./notifications.templates.js";

export const notifier = {
    send: async (event, { user, tx = db, ...data }) => {
        const buildContent = notificationTemplates[event];
        if (!buildContent) throw new Error(`Notifica non gestita: ${event}`);
        const content = buildContent({ user, ...data });

        if (content.inApp && user?.id) {
            // Se c'è una tx in corso, l'insert vive/muore con quella transazione
            await notificationService.create({ userId: user.id, ...content.inApp }, tx);
        }
        // Il canale email, dopo il commit, non deve dipendere da tx
    },
};