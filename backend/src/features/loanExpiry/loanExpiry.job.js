import cron from "node-cron";
import { loanService } from "../../services/loan.service.js";
import { logger } from "../../config/logger.config.js";

export const startLoanExpiryJob = async () => {
    const schedule = process.env.NODE_ENV === 'development'
        ?   "*/1 * * * *"
        :   "0 8 * * *";

    cron.schedule(schedule, async  () => {
        logger.debug("Loan expiry job started");
        try {
            const dueSoon = await loanService.sendDueSoonReminders();
            const overdue = await loanService.sendOverdueReminders();
            logger.info({ dueSoon: dueSoon.processed, overdue: overdue.processed });
        } catch (error) {
            logger.error({ error }, " Loan expiry job failed");
        }
    });

    const mode = process.env.NODE_ENV === "development" ? "every minute" : "daily 08:00";
    logger.info(`Loan expiry job started (${mode}`);
};