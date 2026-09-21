import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";

const RATE_LIMIT_MS = 10 * 60 * 1000;
const STORAGE_KEY = "changePassword:lastSentAt";

const getSecondsRemaining = () => {
    const lastSentAt = localStorage.getItem(STORAGE_KEY);
    if (!lastSentAt) return 0;
    const elapsed = Date.now() - Number(lastSentAt);
    const remaining = RATE_LIMIT_MS - elapsed;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

export function useChangePassword() {
    const navigate = useNavigate();

    const sendChangePasswordLink = async (email) => {
        const remaining = getSecondsRemaining();
        if (remaining > 0) {
            const minutes = Math.ceil(remaining / 60);
            notify.error(`Attendi ancora ${minutes} minut${minutes === 1 ? "o" : "i"} prima di richiedere un nuovo link.`);
            return false;
        }

        try {
            await api.post("/auth/forgot-password", { email });
            localStorage.setItem(STORAGE_KEY, String(Date.now()));
            notify.success("Link per il reset password inviato! Controlla le tue email.");
            return true;
        } catch (err) {
            if (err.response?.status === 429) {
                localStorage.setItem(STORAGE_KEY, String(Date.now()));
                notify.error("Hai già richiesto un link di recente. Riprova più tardi.");
                return false;
            }
            handleApiError(err, navigate);
            return false;
        }
    };

    return { sendChangePasswordLink };
}