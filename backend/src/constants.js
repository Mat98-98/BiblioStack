// Costante globale per i possibili stati delle prenotazioni
export const RESERVATION_STATUS = {
    PENDING: "pending",
    READY: "ready",
    FULFILLED: "fulfilled",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
};

// Costante globale che definisce il tempo di scadenza di una prenotazione una volta che viene assegnato uno status di ready
export const EXPIRY_MS = 4 * 24 * 60 * 60 * 1000;

// Costante globale che definisce il threshold per il fuzzy matching degli autori durante l'inserimento di una nuova opera
export const SIMILARITY_THRESHOLD = 3;