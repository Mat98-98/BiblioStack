import {useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";

export function useReservation({ itemId, userId }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState("all");


    const navigate = useNavigate();

    const fetchReservations =  useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/loans", {params: { page, limit }, signal});
            setReservations(res.data);
        } catch (error) {
            if (error.name === "CanceledError" || error.name === "AbortError") return;
            setError(error);
            handleApiError(error, navigate);
        } finally {
            setLoading(false);
        }
    }, [page, limit, navigate]);

    useEffect(() => {
        const controller = new AbortController();
        fetchReservations(controller.signal);
        return () => controller.abort();
    }, [fetchReservations]);

    const refetch = useCallback(() => fetchReservations(), [fetchReservations]);

    const hasMore = reservations.length === limit;

    return {
        reservations, loading, error, refetch,
        page, setPage, limit, setLimit, hasMore,
        status, setStatus
    };
}

