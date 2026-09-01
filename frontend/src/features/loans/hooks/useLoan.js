import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";

export function useLoan({ workId, userId }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page      = Number(searchParams.get("page") ?? 1);
    const limit     = Number(searchParams.get("limit") ?? 10);
    const search    = searchParams.get("search") ?? "";
    const status    = searchParams.get("status") ?? "all";
    const sortBy    = searchParams.get("sortBy") ?? "loanDate";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLoans = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/loans/search", { params: { page, limit, search, status, sortBy, sortOrder, workId, userId }, signal });
            setLoans(res.data);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setError(err);
            handleApiError(err, navigate);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, status, sortBy, sortOrder, workId, userId, navigate]);

    useEffect(() => {
        const controller = new AbortController();
        fetchLoans(controller.signal);
        return () => controller.abort();
    }, [fetchLoans]);

    const refetch = useCallback(() => fetchLoans(), [fetchLoans]);

    // Euristica: se la pagina è piena, probabilmente ce n'è un'altra
    const hasMore = loans.length === limit;

    // Helper generico: aggiorna uno o più parametri nella query string, resettando la pagina se richiesto
    const updateParams = (updates, resetPage = false) => setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined) next.delete(key);
            else next.set(key, String(value));
        });
        if (resetPage) next.set("page", "1");
        return next;
    });

    const setPage      = (p) => updateParams({ page: p });
    const setLimit      = (l) => updateParams({ limit: l }, true);
    const setSearch     = (s) => updateParams({ search: s }, true);
    const setStatus     = (st) => updateParams({ status: st }, true);
    const setSortBy     = (sb) => updateParams({ sortBy: sb }, true);
    const setSortOrder  = (so) => updateParams({ sortOrder: so }, true);

    // Hook per creare una segnalazione utente associata al prestito
    const createNotice = async (payload) => {
        try {
            await api.post(`/notices`, payload);
            await fetchLoans();
            notify.success("Segnalazione registrata con successo");
        } catch (error) {
            notify.error("Errore nella registrazione della segnalazione");
            throw error;
        }
    };

    return {
        loans, loading, error, refetch,
        page, setPage, limit, setLimit, hasMore,
        search, setSearch, status, setStatus,
        sortBy, setSortBy, sortOrder, setSortOrder,
        createNotice
    };
}