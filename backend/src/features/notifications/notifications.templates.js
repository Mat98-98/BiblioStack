import { NotificationEvent } from "./notification.events.js";

export const notificationTemplates = {
    [NotificationEvent.RESERVATION_CREATED]: ({ reservation }) => ({
        inApp: { title: "Prenotazione registrata", message: `Sei in coda per "${reservation.work?.title ?? "l'opera richiesta"}". Ti avviseremo quando sarà pronta.` }
    }),
    [NotificationEvent.RESERVATION_READY]: ({ reservation }) => ({
        inApp: { title: "Prenotazione pronta", message: `La copia è pronta al ritiro. Hai tempo fino al ${reservation.expiresAt.toLocaleDateString("it-IT")}.` }
    }),
    [NotificationEvent.RESERVATION_EXPIRING_SOON]: ({ reservation }) => ({
        inApp: { title: "Prenotazione in scadenza", message: `Ritira la copia entro il ${reservation.expiresAt.toLocaleDateString("it-IT")} o la prenotazione scadrà.` }
    }),
    [NotificationEvent.RESERVATION_EXPIRED]: ({ reservation }) => ({
        inApp: { title: "Prenotazione scaduta", message: `La tua prenotazione è scaduta perché la copia non è stata ritirata in tempo.` }
    }),
    [NotificationEvent.LOAN_CREATED]: ({ loan }) => ({
        inApp: { title: "Prestito effettuato", message: `Ricordati di riportare il libro entro il ${loan.dueDate.toLocaleDateString("it-IT")}.` }
    }),
    [NotificationEvent.LOAN_DUE_SOON]: ({ loan }) => ({
        inApp: { title: "Prestito in scadenza", message: `Il libro va restituito entro il ${loan.dueDate.toLocaleDateString("it-IT")}.` }
    }),
    [NotificationEvent.LOAN_OVERDUE]: ({ loan }) => ({
        inApp: { title: "Prestito scaduto", message: `Il libro doveva essere restituito il ${loan.dueDate.toLocaleDateString("it-IT")}. Restituiscilo appena possibile.` }
    }),
    [NotificationEvent.USER_SUSPENDED]: ({ suspension }) => ({
        inApp: { title: "Account sospeso", message: suspension.reason ?? "Il tuo account è stato sospeso. Contatta la biblioteca per maggiori informazioni." }
    }),
    [NotificationEvent.USER_REINSTATED]: () => ({
        inApp: { title: "Sospensione terminata", message: "La tua sospensione è terminata. Puoi tornare a utilizzare i servizi della biblioteca." }
    })
};