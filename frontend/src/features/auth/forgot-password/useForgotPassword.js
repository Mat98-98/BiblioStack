import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import { forgotPasswordSchema } from "@/features/auth/forgot-password/forgotPassword.scema.js";
import api from "@/api/axios.js";

const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minuti — allineato al backend
const STORAGE_KEY = "forgotPassword:lastSentAt";

const getSecondsRemaining = () => {
    const lastSentAt = localStorage.getItem(STORAGE_KEY);
    if (!lastSentAt) return 0;
    const elapsed = Date.now() - Number(lastSentAt);
    const remaining = RATE_LIMIT_MS - elapsed;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

export function useForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(getSecondsRemaining);

    const navigate = useNavigate();

    const startCountdown = (seconds) => {
        setSecondsRemaining(seconds);
        const interval = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendResetLink = async () => {
        // Controllo rate limit lato client prima di chiamare il backend
        const remaining = getSecondsRemaining();
        if (remaining > 0) {
            startCountdown(remaining);
            return false;
        }

        const parsed = forgotPasswordSchema.safeParse({ email });
        if (!parsed.success) {
            notify.error(parsed.error.issues?.[0]?.message || "Dati non validi");
            return false;
        }

        setLoading(true);

        try {
            await api.post("/auth/forgot-password", { email });
            localStorage.setItem(STORAGE_KEY, String(Date.now()));
            startCountdown(RATE_LIMIT_MS / 1000);
            setSent(true);
            return true;
        } catch (err) {
            if (err.response?.status === 429) {
                // Fallback: se il backend risponde 429 (es. localStorage cancellato)
                // avvio comunque il countdown
                localStorage.setItem(STORAGE_KEY, String(Date.now()));
                startCountdown(RATE_LIMIT_MS / 1000);
                notify.error("Hai già richiesto un link di recente. Attendi 10 minuti.");
                return false;
            }
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        loading,
        sent,
        setSent,
        secondsRemaining,
        sendResetLink,
    };
}