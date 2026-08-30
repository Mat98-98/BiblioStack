import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

export function safeFormat (date) {
    if (!date) return null;
    const d = date instanceof Date ? date : parseISO(date);
    return format(d, "PPP", { locale: it });
}

export function daysUntil(date) {
    if (!date) return null;

    return Math.max(0, Math.ceil(
        (new Date(date) - new Date()) /
        (1000 * 60 * 60 * 24)
    ));
}