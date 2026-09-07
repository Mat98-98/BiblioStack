import { notificationService } from "../../services/notification.service.js";
import { notificationTemplates } from "./notifications.templates.js";
import { db } from "../../db/connection.js";
import { userRepository } from "../../repositories/user.repository.js";
import { emailService } from "../email/email.service.js";
import { logger } from "../../config/logger.config.js";
import { periodBucket, THROTTLE_DAYS } from "./notification.throttle.js";

// Callback vuota quando non è prevista alcuna azione post commit
const noop = async () => {};

export const notifier = {
    send: async (
        event,
        {user, tx = db, dedupeEntityKey = null, ...data }) => {

        const buildContent = notificationTemplates[event];

        if (!buildContent) throw new Error(`Notification error: ${event}`);

        const content = buildContent({ user, ...data });

        // Se l'evento ha un throttle configurato e il chiamante ha passato l'entità coinvolta costruisco una chiave che cambia solo ogni n giorni
        const throttleDays = THROTTLE_DAYS[event];
        const dedupeKey = (dedupeEntityKey && throttleDays)
            ? `${event}:${dedupeEntityKey}:${periodBucket(throttleDays)}`
            : null;


        if (content.inApp && user?.id) {
            if (dedupeKey) {
                const notification = await notificationService.createDeduped(
                    {
                        userId: user.id,
                        ...content.inApp,
                        dedupeKey
                    }, tx
                );
                // Già notificato
                if (!notification) return noop;

            } else {
                await notificationService.create(
                    {
                        userId: user.id,
                        ...content.inApp,
                    }, tx
                );
            }
        }

        // L'email viene inviata dopo il commit e non deve dipendere dalla transazione.
        if (!content.email) return noop;

        return async () => {
            const recipientEmail = user?.email ?? (await userRepository.findById(user.id))?.email;
            if (!recipientEmail) return;
            try {
                await emailService.sendGeneric({ to: recipientEmail, ...content.email });
            } catch (error) {
                logger.error({ err: error, event }, "Failed to send notification email:");
            }
        };
    }
};