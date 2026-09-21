import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

export function safeFormat (date) {
    if (!date) return null;
    const d = date instanceof Date ? date : parseISO(date);
    return format(d, "PPP", { locale: it });
}

// Se si passa noMax = true il return restituisce anche risultati negativi (-5, -6 ecc.). Comodo per sapere ad esempio quanti giorni fa è scaduto un prestito
export function daysUntil(date, { noMax = false } = {}) {
    if (!date) return null;

    const days = Math.ceil(
        (new Date(date) - new Date()) /
        (1000 * 60 * 60 * 24)
    );

    return noMax ? days : Math.max(0, days);
}