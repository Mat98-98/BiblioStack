import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";


export function useMyCard() {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renewing, setRenewing] = useState(false);
    const navigate = useNavigate();

    const fetchCard = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/cards/me");
            setToken(data.token);
        } catch (error) {
            setToken(null);
            handleApiError(error, navigate);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCard() }, [fetchCard]);

    const renew = async () => {
        setRenewing(true);
        try {
            const { data } = await api.post("/cards/me/renew");
            setToken(data.token);
            notify.success("Tessera rinnovata");
        } catch (error) {
            handleApiError(error, navigate);
        } finally {
            setRenewing(false);
        }
    };

    return { token, loading, renewing, renew };
}