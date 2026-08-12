import { useState } from "react";
import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";

export function useReservations(initialReservations) {
    const [reservations, setReservations] = useState(initialReservations);
    const [loadingId, setLoadingId] = useState(null); // Traccia quale prenotazione sta caricando

    // Mostra SOLO pending e ready
    const visibleReservations = reservations.filter((reservation) =>
        ["pending", "ready"].includes(reservation.status)
    );

    const cancelReservation = async (id) => {
        setLoadingId(id);
        try {
            await api.patch(`/reservations/${id}`, { status: "cancelled" });
            notify.success("Prenotazione annullata");

            // Rimuove la prenotazione dallo stato locale
            setReservations((prev) => prev.filter((r) => r.id !== id));
            return true;
        } catch {
            notify.error("Errore nell'annullamento");
            return false;
        } finally {
            setLoadingId(null);
        }
    };

    return {
        reservations: visibleReservations,
        loadingId,
        cancelReservation,
    };
}