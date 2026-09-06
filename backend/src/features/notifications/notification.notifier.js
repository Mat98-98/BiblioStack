import { notificationService } from "../../services/notification.service.js";
import { notificationTemplates } from "./notifications.templates.js";
import { db } from "../../db/connection.js";
import {userRepository} from "../../repositories/user.repository.js";
import {emailService} from "../email/email.service.js";
import {logger} from "../../config/logger.config.js";

// Callback vuota quando non è prevista alcuna azione post commit
const noop = async () => {};

export const notifier = {
    send: async (event, { user, tx = db, ...data }) => {
        const buildContent = notificationTemplates[event];
        if (!buildContent) throw new Error(`Notification error: ${event}`);
        const content = buildContent({ user, ...data });

        if (content.inApp && user?.id) {
            // Se c'è una tx in corso, l'insert vive/muore con quella transazione
            await notificationService.create({ userId: user.id, ...content.inApp }, tx);
        }

        // L'email viene inviata dopo il commit e non deve dipendere dalla transazione.
        if (!content.email) return noop;

        return async () => {
            const recipientEmail = user?.email ?? (await userRepository.findById(user.id))?.email;
            if (!recipientEmail) return;
            try {
                await emailService.sendGeneric({ to: recipientEmail, ...content.email });
            } catch (error) {
                logger.error("Failed to send notification email:", error);
            }
        };
    }
};