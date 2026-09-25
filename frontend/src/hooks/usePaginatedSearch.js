import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

const DEFAULT_LIMIT = 50;
const DEBOUNCE_MS = 300;

// Hook generico per combobox asincroni: lazy opening, gestisce scroll infinito e ricerca con debounce.
// Compatibile con qualsiasi endpoint che risponde { data: [...], hasMore: boolean }.
export function usePaginatedSearch(endpoint, { limit = DEFAULT_LIMIT } = {}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loaded, setLoaded] = useState(false);

    const loadingRef = useRef(false);
    const debounceRef = useRef(null);

    const fetchItems = useCallback(async (pageToFetch, searchTerm) => {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const res = await api.get(endpoint, {
                params: { page: pageToFetch, limit, search: searchTerm || undefined }
            });

            setItems(prev =>
                pageToFetch === 1 ? res.data.data : [...prev, ...res.data.data]
            );
            setHasMore(res.data.hasMore);
            setPage(pageToFetch);
        } catch (err) {
            setError(err);

            // In caso di errori, mando solo il primo con toaster
            if (pageToFetch === 1) {
                handleApiError(err);
            } else {
                console.error(`Failed to load more items from ${endpoint}`, err);
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [endpoint, limit]);

    const open = useCallback(() => {
        if (loaded || loadingRef.current) return;
        setLoaded(true);
        void fetchItems(1, "");
    }, [loaded, fetchItems]);

    const loadMore = useCallback(() => {
        if (!hasMore || loadingRef.current) return;
        void fetchItems(page + 1, search);
    }, [hasMore, page, search, fetchItems]);

    const updateSearch = useCallback((value) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            void fetchItems(1, value);
        }, DEBOUNCE_MS);
    }, [fetchItems]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return { items, loading, error, hasMore, search, open, loadMore, updateSearch };
}