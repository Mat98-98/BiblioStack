import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";

export function useDashboard() {
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    const [notices, setNotices] = useState([]);
    const [noticesLoading, setNoticesLoading] = useState(true);
    const [noticesError, setNoticesError] = useState(null);

    const [readyReservations, setReadyReservations] = useState([]);
    const [readyReservationsLoading, setReadyReservationsLoading] = useState(true);
    const [readyReservationsError, setReadyReservationsError] = useState(null);

    const navigate = useNavigate();

    const fetchStats = useCallback(async (signal) => {
        setStatsLoading(true);
        setStatsError(null);
        try {
            const res = await api.get("/operator-dashboard/stats", { signal });
            setStats(res.data);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setStatsError(err);
            handleApiError(err, navigate);
        } finally {
            setStatsLoading(false);
        }
    }, [navigate]);

    const fetchNotices = useCallback(async (signal) => {
        setNoticesLoading(true);
        setNoticesError(null);
        try {
            const res = await api.get("/operator-dashboard/recent-notices", { params: { limit: 5 }, signal });
            setNotices(res.data);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setNoticesError(err);
            handleApiError(err, navigate);
        } finally {
            setNoticesLoading(false);
        }
    }, [navigate]);

    const fetchReadyReservations = useCallback(async (signal) => {
        setReadyReservationsLoading(true);
        setReadyReservationsError(null);
        try {
            const res = await api.get("/operator-dashboard/ready-reservations", { params: { limit: 5 }, signal });
            setReadyReservations(res.data);
        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setReadyReservationsError(err);
            handleApiError(err, navigate);
        } finally {
            setReadyReservationsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const statsController = new AbortController();
        const noticesController = new AbortController();
        const reservationsController = new AbortController();
        fetchStats(statsController.signal);
        fetchNotices(noticesController.signal);
        fetchReadyReservations(reservationsController.signal);
        return () => {
            statsController.abort();
            noticesController.abort();
            reservationsController.abort();
        };
    }, [fetchStats, fetchNotices, fetchReadyReservations]);

    const refetch = useCallback(() => {
        fetchStats();
        fetchNotices();
        fetchReadyReservations();
    }, [fetchStats, fetchNotices, fetchReadyReservations]);

    return {
        stats, statsLoading, statsError,
        notices, noticesLoading, noticesError,
        readyReservations, readyReservationsLoading, readyReservationsError,
        refetch
    };
}