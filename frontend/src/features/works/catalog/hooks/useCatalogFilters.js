import api from "@/api/axios.js";
import {useEffect, useState } from "react";

// Hook per i filtri del catalogo
export function useCatalogFilters() {
    const [filters, setFilters] = useState({
        genres: [],
        languages: [],
        publishers: []
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadFilters = async () => {
            try {
                // Fetch parallelo
                const [g, l, p] = await Promise.all([
                    api.get("/genres?limit=100"),
                    api.get("/languages"),
                    api.get("/publishers?limit=100"),
                ])

                setFilters({
                    genres: g.data,
                    languages: l.data,
                    publishers: p.data
                })

            } catch (err) {
                console.error("Failed to load filters", err)
            } finally {
                setLoading(false)
            }
        }

        loadFilters()
    }, [])

    return { ...filters, loading }
}