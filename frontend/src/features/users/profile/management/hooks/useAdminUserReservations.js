import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";


export function useAdminUserReservations(userId) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(searchParams.get("reservationPage") ?? 1);
    const limit = Number(searchParams.get("reservationLimit") ?? 10);
    const search = searchParams.get("reservationSearch") ?? "";
    const status = searchParams.get("reservationStatus") ?? "all";
    const sortOrder =
        searchParams.get("reservationSortOrder") ?? "desc";

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReservations = useCallback(async (signal) => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.get("/reservations/search", {
                params: {
                    userId,
                    page, limit,
                    search,
                    status,
                    sortOrder,
                },
                signal,
            });

            setReservations(res.data);
        } catch (err) {
            if (
                err.name === "CanceledError" ||
                err.name === "AbortError"
            ) {
                return;
            }

            setError(err);
            handleApiError(err, navigate);
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [
        userId,
        page, limit,
        search,
        status,
        sortOrder,
        navigate,
    ]);

    useEffect(() => {
        const controller = new AbortController();

        void fetchReservations(controller.signal);

        return () => controller.abort();
    }, [fetchReservations]);

    const refetch = useCallback(
        () => fetchReservations(),
        [fetchReservations]
    );

    const hasMore = reservations.length === limit;

    const updateParams = (updates, resetPage = false) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(updates).forEach(([key, value]) => {
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });

            if (resetPage) {
                next.set("reservationPage", "1");
            }

            return next;
        });
    };

    const setPage = (value) =>
        updateParams({ reservationPage: value });

    const setLimit = (value) =>
        updateParams({ reservationLimit: value }, true);

    const setSearch = (value) =>
        updateParams({ reservationSearch: value }, true);

    const setStatus = (value) =>
        updateParams({ reservationStatus: value }, true);

    const setSortOrder = (value) =>
        updateParams(
            { reservationSortOrder: value },
            true
        );

    return {
        reservations,
        loading, error, refetch,
        page, setPage, limit, setLimit, hasMore,
        search, setSearch,
        status, setStatus,
        sortOrder, setSortOrder,
    };
}