import { useState } from "react";
import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";

export function useCancelReservation() {
    const [loadingId, setLoadingId] = useState(null);

    const cancelReservation = async (id) => {
        setLoadingId(id);

        try {
            await api.patch(`/reservations/${id}`, {
                status: "cancelled",
            });

            notify.success("Prenotazione annullata");

            return true;
        } catch {
            notify.error("Errore nell'annullamento");
            return false;
        } finally {
            setLoadingId(null);
        }
    };

    return {
        loadingId,
        cancelReservation,
    };
}