import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

export function useUserDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/users/me/dashboard");
                setDashboard(res.data);
            } catch (err) {
                setError(err);
                handleApiError(err, navigate);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    return { dashboard, loading, error };
}