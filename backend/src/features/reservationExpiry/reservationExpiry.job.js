import cron from "node-cron";
import { reservationService } from "../../services/reservation.service.js";

// Esegue ogni ora (puoi cambiare la frequenza)
// Sintassi cron: "minuto ora giorno mese giornoSettimana"
// "0 * * * *" = ogni ora allo scoccare del minuto 0
// "*/15 * * * *" = ogni 15 minuti

export const startReservationExpiryJob = () => {
    const schedule = process.env.NODE_ENV === "development"
        ? "*/1 * * * *"
        : "0 * * * *";

    cron.schedule(schedule, async () => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 🕐 Job scadenza prenotazioni...`);
        try {
            const result = await reservationService.processExpiredReservations();
            console.log(`[${timestamp}] ✅ ${result.processed} prenotazioni elaborate`);
        } catch (err) {
            console.error(`[${timestamp}] ❌ Job fallito:`, err);
        }
    });

    const mode = process.env.NODE_ENV === "development" ? "ogni 15 minuti" : "ogni ora";
    console.log(`⏰ Job scadenza prenotazioni avviato (${mode})`);
};