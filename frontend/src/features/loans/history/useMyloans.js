import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";

// Come useLoan, ma per lo storico personale: nessun parametro userId (lo decide sempre
// il backend dal token) e chiama /loans/mine invece di /loans/search.
export function useMyLoans() {
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
            const res = await api.get("/loans/mine", {
                params: { page, limit, search, status, sortBy, sortOrder },
                signal
            });

            setLoans(res.data);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;

            setError(err);
            handleApiError(err, navigate);
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [page, limit, search, status, sortBy, sortOrder, navigate]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchLoans(controller.signal);
        return () => controller.abort();
    }, [fetchLoans]);

    const refetch = useCallback(() => fetchLoans(), [fetchLoans]);

    // Euristica: se la pagina è piena, probabilmente ce n'è un'altra (come in useLoan)
    const hasMore = loans.length === limit;

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
    const setSort = (sortBy, sortOrder) =>
        updateParams({ sortBy, sortOrder }, true);

    return {
        loans, loading, error, refetch,
        page, setPage, limit, setLimit, hasMore,
        search, setSearch, status, setStatus,
        sortBy, sortOrder, setSort
    };
}