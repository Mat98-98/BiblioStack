import { useState, useEffect } from "react";
import api from "@/api/axios.js";

export function usePublicationCountries() {
    const [publicationCountries, setPublicationCountries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/publicationCountries", { params: { limit: 100 } });
                setPublicationCountries(data);
            } catch (error) {
                console.error("Errore durante il caricamento dei paesi di pubblicazione:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    return { publicationCountries, loading };
}