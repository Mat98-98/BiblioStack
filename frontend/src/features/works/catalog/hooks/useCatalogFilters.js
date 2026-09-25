import { useCallback, useRef, useState } from "react";
import api from "@/api/axios.js";
import {usePaginatedSearch} from "@/hooks/usePaginatedSearch.js";

// Genere e lingua sono liste piccole e stabili: le carichiamo insieme,
// lazy, alla prima apertura di uno qualsiasi dei due filtri.
export function useCatalogFilters() {
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const loadingRef = useRef(false);

    const open = useCallback(() => {
        if (loaded || loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        Promise.all([
            api.get("/genres?limit=50"),
            api.get("/languages"),
        ])
            .then(([g, l]) => {
                setGenres(g.data);
                setLanguages(l.data);
                setLoaded(true);
            })
            .catch((err) => console.error("Failed to load filters", err))
            .finally(() => {
                loadingRef.current = false;
                setLoading(false);
            });
    }, [loaded]);

    const publishers = usePaginatedSearch("/publishers/search");

    return { genres, languages, publishers, loading, open };
}