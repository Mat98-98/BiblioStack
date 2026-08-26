import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

export function safeFormat (date) {
    if (!date) return null;
    const d = date instanceof Date ? date : parseISO(date);
    return format(d, "PPP", { locale: it });
}