
// Costante globale che definisce il role id di un certo ruolo
export const ROLE_IDS = {
    ADMIN: 1,
    LIBRARIAN: 2,
    SYSTEM: 3,
    STUDENT: 4
};
// Costante globale che definisce il ruolo predefinito
export const DEFAULT_USER_ROLE_ID = ROLE_IDS.STUDENT;

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
