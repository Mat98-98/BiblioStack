import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

export function useUserDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/users/me/dashboard");
                setUser(res.data);
            } catch (err) {
                setError(err);
                handleApiError(err, navigate);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    return { user, loading, error };
}