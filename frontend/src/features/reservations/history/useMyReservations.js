import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";
import { useCancelReservation } from "@/features/reservations/hooks/useCancelReservation.js";

// Specchio di useMyLoans: nessun parametro userId (lo decide sempre il backend dal token),
// chiama /reservations/mine — endpoint ANCORA DA COSTRUIRE lato backend, stesso schema
// di sicurezza di /loans/mine (verifyUser + userId forzato server-side, mai dal client).
export function useMyReservations() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page      = Number(searchParams.get("page") ?? 1);
    const limit     = Number(searchParams.get("limit") ?? 10);
    const search    = searchParams.get("search") ?? "";
    const status    = searchParams.get("status") ?? "all";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReservations = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/reservations/mine", {
                params: { page, limit, search, status, sortOrder },
                signal
            });
            setReservations(res.data);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setError(err);
            handleApiError(err, navigate);
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [page, limit, search, status, sortOrder, navigate]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchReservations(controller.signal);
        return () => controller.abort();
    }, [fetchReservations]);

    const refetch = useCallback(() => fetchReservations(), [fetchReservations]);

    const { cancelReservation: cancel } = useCancelReservation();

    const cancelReservation = async (id) => {
        const success = await cancel(id);

        if (success) {
            setReservations((prev) => prev.filter((r) => r.id !== id));
        }

        return success;
    };

    const hasMore = reservations.length === limit;

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
    const setSearch     = (s) => updateParams({ search: s }, true);
    const setStatus     = (st) => updateParams({ status: st }, true);
    const setSortOrder  = (so) => updateParams({ sortOrder: so }, true);

    return {
        reservations, loading, error, refetch,
        page, setPage, hasMore,
        search, setSearch, status, setStatus,
        sortOrder, setSortOrder,
        cancelReservation
    };
}