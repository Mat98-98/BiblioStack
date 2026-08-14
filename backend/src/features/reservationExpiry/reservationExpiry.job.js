import cron from "node-cron";
import { reservationService } from "../../services/reservation.service.js";
import { logger } from "../../config/logger.config.js";


// Esegue ogni ora (puoi cambiare la frequenza)
// Sintassi cron: "minuto ora giorno mese giornoSettimana"
// "0 * * * *" = ogni ora allo scoccare del minuto 0
// "*/15 * * * *" = ogni 15 minuti

export const startReservationExpiryJob = () => {
    const schedule = process.env.NODE_ENV === "development"
        ? "*/1 * * * *"
        : "0 * * * *";

    cron.schedule(schedule, async () => {
        logger.debug("Reservation expiry job started");
        try {
            const result = await reservationService.processExpiredReservations();
            logger.info({ processed: result.processed }, "Expired reservations processed");
        } catch (err) {
            logger.error({ err }, "Reservation expiry job failed");
        }
    });

    const mode = process.env.NODE_ENV === "development" ? "every minute" : "every hour";
    logger.info(`Reservation expiry job started (${mode})`);
};