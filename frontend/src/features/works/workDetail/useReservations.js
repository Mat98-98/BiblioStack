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
            if (err.response?.status === 400) {
                const code = err.response.data?.code;
                if (code === "BAD_REQUEST" && err.response.data?.message?.includes("loan")) {
                    notify.error("Hai già questo libro in prestito.");
                } else {
                    notify.error("Hai già una prenotazione attiva per quest'opera.");
                }
                return false;
            }
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { reserve, loading };
}