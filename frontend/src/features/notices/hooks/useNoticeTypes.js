import { useState, useEffect } from "react";
import api from "@/api/axios.js";

// enabled: quando true (dialog aperto) esegue la fetch, una sola volta
export function useNoticeTypes(enabled) {
    const [noticeTypes, setNoticeTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!enabled || fetched) return;

        const fetchTypes = async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/notice-types");
                setNoticeTypes(data);
                setFetched(true);
            } catch {
                setNoticeTypes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
    }, [enabled, fetched]);

    return { noticeTypes, loading };
}