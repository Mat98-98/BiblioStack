import cron from "node-cron";
import { logger } from "../../config/logger.config.js";
import { reservationService } from "../../services/reservation.service.js";

export const startReservationReminderJob = async () => {
    const schedule = process.env.NODE_ENV === 'development'
        ?   "*/1 * * * *"
        :   "0 8 * * *";

    cron.schedule(schedule, async  () => {
        logger.debug("Reservation remininder job started");
        try {
            const result = await reservationService.processExpiringSoonReservations();
            logger.info({ processed: result.processed }, " Reservation reminders sent");
        } catch (error) {
            logger.error({ error }, " Reservation job failed");
        }
    });

    const mode = process.env.NODE_ENV === "development" ? "every minute" : "daily 08:00";
    logger.info(`Reservation reminder job started (${mode}`);
};