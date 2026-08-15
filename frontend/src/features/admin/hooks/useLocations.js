import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

export function useLocations(enabled = true) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!enabled) return;

        const fetchLocations = async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/locations");
                setLocations(data);
            } catch (err) {
                handleApiError(err, navigate);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [enabled, navigate]);

    return { locations, loading };
}