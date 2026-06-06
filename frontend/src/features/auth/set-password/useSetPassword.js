import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";
import { setPasswordSchema } from "@/features/auth/set-password/setPassword.schema.js";



const ENDPOINT = {
    reset: "/auth/reset-password",
    setup: "/auth/setup-account",
};

const SUCCESS_MESSAGE = {
    reset: "Password reimpostata con successo!",
    setup: "Account configurato! Puoi ora accedere.",
};

// mode: "reset" | "setup"
export function useSetPassword(mode) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const submit = async () => {
        if (!token) {
            notify.error("Token non valido o scaduto.");
            return false;
        }

        const parsed = setPasswordSchema.safeParse({ password, confirmPassword });
        if (!parsed.success) {
            notify.error(parsed.error.issues?.[0]?.message || "Dati non validi");
            return false;
        }

        setLoading(true);

        try {
            await api.post(ENDPOINT[mode], { token, password });
            notify.success(SUCCESS_MESSAGE[mode]);
            navigate("/login", { replace: true });
            return true;
        } catch (err) {
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        token,
        submit,
    };
}