// Permette di convertire l'input in una stringa sicura, rimuove spazi inutili, controlla se la search è vuota

export const normalizeSearch = (search) => {
    const term = String(search || "").trim();

    return {
        term,
        pattern: term ? `%${term}%` : null,
        isEmpty: term.length === 0
    };
};