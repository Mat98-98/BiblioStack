import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";

export function useReservation() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const reserve = async (workId) => {
        setLoading(true);
        try {
            await api.post("/reservations", { workId });
            notify.success("Prenotazione effettuata con successo!");
            return true;
        } catch (err) {
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { reserve, loading };
}