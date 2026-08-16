import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import api from "@/api/axios.js"

const LIMIT = 20

export function useCatalog() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Leggi i filtri dall'URL così sono shareable e persistenti
    const search      = searchParams.get("search")      ?? ""
    const genreId     = searchParams.get("genreId")     ?? ""
    const languageCode = searchParams.get("languageCode") ?? ""
    const publisherId = searchParams.get("publisherId") ?? ""
    const page        = Number(searchParams.get("page") ?? 1)

    const [works, setWorks]     = useState([])
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)

    const fetchWorks = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                search,
                page,
                limit: LIMIT,
                ...(genreId      && { genreId:      Number(genreId) }),
                ...(languageCode && { languageCode }),
                ...(publisherId  && { publisherId:  Number(publisherId) }),
            }
            const res = await api.get("/works/search", { params })
            setWorks(res.data)
            setHasMore(res.data.length === LIMIT)
        } catch {
            setWorks([])
        } finally {
            setLoading(false)
        }
    }, [search, genreId, languageCode, publisherId, page])

    useEffect(() => {
        fetchWorks()
    }, [fetchWorks])

    const setFilter = (key, value) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            if (value) next.set(key, value)
            else next.delete(key)
            next.set("page", "1") // reset pagina quando cambia filtro
            return next
        })
    }

    const setPage = (p) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            next.set("page", String(p))
            return next
        })
    }

    const clearFilters = () => {
        setSearchParams({ page: "1" })
    }

    const activeFiltersCount = [genreId, languageCode, publisherId].filter(Boolean).length

    return {
        works,
        loading,
        hasMore,
        page,
        search,
        filters: { genreId, languageCode, publisherId },
        activeFiltersCount,
        setFilter,
        setPage,
        clearFilters,
    }
}