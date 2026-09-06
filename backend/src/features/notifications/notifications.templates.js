import { NotificationEvent } from "./notification.events.js";
import { emailTemplates } from "../email/email.templates.js";
import { BASE_URL } from "../email/email.service.js";

const ACCENT = { primary: "#614afc", success: "#009056", warning: "#e88100", destructive: "#e62b34" };

export const notificationTemplates = {
    [NotificationEvent.RESERVATION_CREATED]: ({ reservation }) => ({
        inApp: { title: "Prenotazione registrata", message: `Sei in coda per "${reservation.work?.title ?? "l'opera richiesta"}". Ti avviseremo quando sarà pronta.` }
    }),

    [NotificationEvent.RESERVATION_READY]: ({ reservation }) => {
        const dueStr = reservation.expiresAt.toLocaleDateString("it-IT");
        return {
            inApp: { title: "Prenotazione pronta", message: `La copia è pronta al ritiro. Hai tempo fino al ${dueStr}.` },
            email: {
                subject: "La tua prenotazione è pronta — BiblioStack",
                html: emailTemplates.layout({
                    heading: "La tua copia ti aspetta",
                    bodyHtml: `<p>La copia prenotata è pronta per il ritiro. Hai tempo fino al <strong>${dueStr}</strong>, dopodiché la prenotazione scadrà automaticamente.</p>`,
                    ctaText: "Vai alle tue prenotazioni",
                    ctaLink: `${BASE_URL}/reservations`,
                    accent: ACCENT.success,
                })
            }
        };
    },

    [NotificationEvent.RESERVATION_EXPIRING_SOON]: ({ reservation }) => {
        const dueStr = reservation.expiresAt.toLocaleDateString("it-IT");
        return {
            inApp: { title: "Prenotazione in scadenza", message: `Ritira la copia entro il ${dueStr} o la prenotazione scadrà.` },
            email: {
                subject: "La tua prenotazione sta per scadere — BiblioStack",
                html: emailTemplates.layout({
                    heading: "Non dimenticare il ritiro",
                    bodyHtml: `<p>La copia prenotata ti aspetta ancora, ma solo fino al <strong>${dueStr}</strong>. Passato questo termine, la prenotazione scadrà e la copia sarà riassegnata.</p>`,
                    ctaText: "Vai alle tue prenotazioni",
                    ctaLink: `${BASE_URL}/reservations`,
                    accent: ACCENT.warning,
                })
            }
        };
    },

    [NotificationEvent.RESERVATION_EXPIRED]: ({ reservation }) => ({
        inApp: { title: "Prenotazione scaduta", message: `La tua prenotazione è scaduta perché la copia non è stata ritirata in tempo.` }
    }),

    [NotificationEvent.LOAN_CREATED]: ({ loan }) => {
        const dueStr = loan.dueDate.toLocaleDateString("it-IT");
        return {
            inApp: { title: "Prestito effettuato", message: `Ricordati di riportare il libro entro il ${dueStr}.` },
            email: {
                subject: "Prestito confermato — BiblioStack",
                html: emailTemplates.layout({
                    heading: "Prestito registrato",
                    bodyHtml: `<p>Il prestito è stato registrato con successo. Ricordati di riportare il libro entro il <strong>${dueStr}</strong>.</p>`,
                    ctaText: "Vai ai tuoi prestiti",
                    ctaLink: `${BASE_URL}/loans`,
                    accent: ACCENT.primary,
                })
            }
        };
    },

    [NotificationEvent.LOAN_DUE_SOON]: ({ loan }) => {
        const dueStr = loan.dueDate.toLocaleDateString("it-IT");
        return {
            inApp: { title: "Prestito in scadenza", message: `Il libro va restituito entro il ${dueStr}.` },
            email: {
                subject: "Il tuo prestito sta per scadere — BiblioStack",
                html: emailTemplates.layout({
                    heading: "Restituzione in arrivo",
                    bodyHtml: `<p>Il libro in prestito va restituito entro il <strong>${dueStr}</strong>.</p>`,
                    ctaText: "Vai ai tuoi prestiti",
                    ctaLink: `${BASE_URL}/loans`,
                    accent: ACCENT.warning,
                })
            }
        };
    },

    [NotificationEvent.LOAN_OVERDUE]: ({ loan }) => {
        const dueStr = loan.dueDate.toLocaleDateString("it-IT");
        return {
            inApp: { title: "Prestito scaduto", message: `Il libro doveva essere restituito il ${dueStr}. Restituiscilo appena possibile.` },
            email: {
                subject: "Prestito scaduto — BiblioStack",
                html: emailTemplates.layout({
                    heading: "Restituzione in ritardo",
                    bodyHtml: `<p>Il libro doveva essere restituito il <strong>${dueStr}</strong>. Ti chiediamo di riportarlo il prima possibile in biblioteca.</p>`,
                    ctaText: "Vai ai tuoi prestiti",
                    ctaLink: `${BASE_URL}/loans`,
                    accent: ACCENT.destructive,
                })
            }
        };
    },

    [NotificationEvent.USER_SUSPENDED]: ({ suspension }) => ({
        inApp: { title: "Account sospeso", message: suspension.reason ?? "Il tuo account è stato sospeso. Contatta la biblioteca per maggiori informazioni." }
    }),

    [NotificationEvent.USER_REINSTATED]: () => ({
        inApp: { title: "Sospensione terminata", message: "La tua sospensione è terminata. Puoi tornare a utilizzare i servizi della biblioteca." }
    }),
};