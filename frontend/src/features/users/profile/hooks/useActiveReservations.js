import { useState } from "react";
import { useCancelReservation } from "@/features/reservations/hooks/useCancelReservation.js";

export function useActiveReservations(reservations) {
    const [activeReservations, setActiveReservations] = useState(reservations);
    const {loadingId, cancelReservation: cancel} = useCancelReservation();


    const cancelReservation = async (id) => {
        const success = await cancel(id);

        if (success) {
            setActiveReservations((prev) =>
                prev.filter((reservation) => reservation.id !== id)
            );
        }
        return success;
    };

    return {
        reservations: activeReservations,
        loadingId,
        cancelReservation
    };
}