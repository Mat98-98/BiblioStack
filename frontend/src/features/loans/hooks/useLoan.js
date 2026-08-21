import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";


export function useLoan({ workId , userId }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("loanDate");
    const [sortOrder, setSortOrder] = useState("desc");

    const navigate = useNavigate();

    const fetchLoans = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/loans/search", { params: { page, limit, search, status, sortBy, sortOrder, userId }, signal });
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

    // Reset alla prima pagina quando cambiano i filtri per evitare pagine vuote
    useEffect(() => {
        setPage(1);
    }, [search, status, sortBy, sortOrder]);

    const refetch = useCallback(() => fetchLoans(), [fetchLoans]);

    // Euristica: se la pagina è piena, probabilmente ce n'è un'altra
    const hasMore = loans.length === limit;

    return {
        loans, loading, error, refetch,
        page, setPage, limit, setLimit, hasMore,
        search, setSearch, status, setStatus,
        sortBy, setSortBy, sortOrder, setSortOrder
    };
}