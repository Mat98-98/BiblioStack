import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

export function useAdminUserLoans(userId) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(searchParams.get("loanPage") ?? 1);
    const limit = Number(searchParams.get("loanLimit") ?? 10);
    const search = searchParams.get("loanSearch") ?? "";
    const status = searchParams.get("loanStatus") ?? "all";
    const sortBy = searchParams.get("loanSortBy") ?? "loanDate";
    const sortOrder = searchParams.get("loanSortOrder") ?? "desc";

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLoans = useCallback(async (signal) => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.get("/loans/search", {
                params: {
                    userId,
                    page, limit,
                    search,
                    status,
                    sortBy, sortOrder,
                },
                signal,
            });

            setLoans(res.data);
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
        sortBy, sortOrder,
        navigate
    ]);

    useEffect(() => {
        const controller = new AbortController();

        void fetchLoans(controller.signal);

        return () => controller.abort();
    }, [fetchLoans]);

    const refetch = useCallback(
        () => fetchLoans(),
        [fetchLoans]
    );

    const hasMore = loans.length === limit;

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
                next.set("loanPage", "1");
            }

            return next;
        });
    };

    const setPage = (value) =>
        updateParams({
            loanPage: value,
        });

    const setLimit = (value) =>
        updateParams(
            {
                loanLimit: value,
            },
            true
        );

    const setSearch = (value) =>
        updateParams(
            {
                loanSearch: value,
            },
            true
        );

    const setStatus = (value) =>
        updateParams(
            {
                loanStatus: value,
            },
            true
        );

    const setSort = (sortBy, sortOrder) =>
        updateParams(
            {
                loanSortBy: sortBy,
                loanSortOrder: sortOrder,
            },
            true
        );

    return {
        loans, loading, error, refetch,
        page, setPage, limit, setLimit, hasMore,
        search, setSearch,
        status, setStatus,
        sortBy, sortOrder, setSort
    };
}