import { NotificationEvent } from "./notification.events.js";

// Intervallo in giorni prima che lo stesso evento per la stessa entità possa essere rimandato
export const THROTTLE_DAYS = {
    [NotificationEvent.LOAN_OVERDUE] : 7
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Divide il tempo in bucket di ampiezza intervalDays
export const periodBucket = (intervalDays, at = new Date ()) =>
    Math.floor(at.getTime() / (intervalDays * MS_PER_DAY));