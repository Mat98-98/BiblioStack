import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";
import { CardTokenSchema } from "@/features/qrCode/schema/cardToken.schema.js";


export function useCardVerification() {
    const [result, setResult] = useState(null); // { valid: boolean, userId?: number } | null
    const [checking, setChecking] = useState(false);

    const navigate = useNavigate();

    // Validazione per scremare grossi errori di lettura barcode per evitare chiamate inutili alle API
    const verify = async (rawToken) => {
        const parsed = CardTokenSchema.safeParse(rawToken);
        if (!parsed.success) {
            setResult({ valid: false });
            return;
        }

        setChecking(true);
        try {
            const { data } = await api.post("/cards/verify", { token: parsed.data });
            setResult(data);
        } catch (error) {
            const data = error.response?.data;
            /*
             - 401 con {valid: false} è l'esito di "tessera non valida"
             - 401/500/altro con {code} è un errore applicativo e lo gestisco con l'handler apposito
             */
            if (error.response?.status === 401 && error.response.data?.valid === false) {
                setResult(error.response.data);
            } else {
                handleApiError(error, navigate);
                setResult(null);
            }
        } finally {
            setChecking(false);
        }
    };

    const reset = () => setResult(null);

    return { result, checking, verify, reset };
}