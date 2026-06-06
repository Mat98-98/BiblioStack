import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";

import { useAuth } from "@/context/AuthContext.jsx";

// Creo lo schema che definisce il tipo e i dati che posso ricevere dal form
const loginSchema = z.object({
    email: z.email("Email non valida"),
    password: z.string().min(8, "Password troppo corta"),
})

export function useLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const auth = useAuth();

    const login = async () => {

        // Validazione input con schema zod
        const parsed = loginSchema.safeParse({
            email,
            password
        });

        if (!parsed.success) {
            notify.error(parsed.error.issues?.[0]?.message || "Dati non validi");
            return false;
        }

        setLoading(true);

        try {
            // Login auth context
            await auth.login(email, password);
            notify.success("Login effettuato");

            // Redirect alla homepage dopo aver effettuato il login
            navigate("/", {
                replace: true // evita ritorno alla login con back
            });
            return true;
        } catch (err) {
            // Invio errori a helper centralizzato
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        login
    }
}