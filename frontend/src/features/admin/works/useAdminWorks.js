import { useState, useEffect, useCallback } from "react"
import {data, useSearchParams} from "react-router-dom"
import api from "@/api/axios.js"
import { notify } from "@/lib/notify.js"

export function useAdminWorks() {
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get("search") ?? ""
    const page   = Number(searchParams.get("page") ?? 1)
    const limit  = Number(searchParams.get("limit") ?? 20)

    const [works, setWorks]     = useState([])
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)

    const fetchWorks = useCallback(async () => {
        setLoading(true)
        try {
            const endpoint = search ? "/works/search" : "/works"
            const res = await api.get(endpoint, { params: { search, page, limit } })
            setWorks(res.data)
            setHasMore(res.data.length === limit)
        } catch {
            setWorks([])
        } finally {
            setLoading(false)
        }
    }, [search, page, limit])

    useEffect(() => { fetchWorks() }, [fetchWorks])

    const setSearch = (v) => setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        if (v) next.set("search", v)
        else next.delete("search")
        next.set("page", "1")
        return next
    })

    const setPage = (p) => setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.set("page", String(p))
        return next
    })


    const deleteWork = async (workId) => {
        try {
            await api.delete(`/works/${workId}`)
            setWorks(prev => prev.filter(w => w.id !== workId))
            notify.success("Opera eliminata")
        } catch {
            notify.error("Errore nell'eliminazione")
        }
    }

    const updateWork = async (workId) => {
        try {
            await api.patch(`/works/${workId}`)
            setWorks(prev => prev.filter(w => w.id !== workId))
            notify.success("Opera modificata con successo")
        } catch {
            notify.error("Errore nella modifica dell'opera")
        }
    }

    return {
        works, loading, hasMore, page, search,
        setSearch, setPage,
        deleteWork
    }
}