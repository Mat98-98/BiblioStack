import { useState, useEffect } from "react"
import api from "@/api/axios.js"

export function useCatalogFilters() {
    const [genres, setGenres]         = useState([])
    const [languages, setLanguages]   = useState([])
    const [publishers, setPublishers] = useState([])

    useEffect(() => {
        Promise.all([
            api.get("/genres?limit=100"),
            api.get("/languages"),
            api.get("/publishers?limit=100"),
        ]).then(([g, l, p]) => {
            setGenres(g.data)
            setLanguages(l.data)
            setPublishers(p.data)
        }).catch(() => {})
    }, [])

    return { genres, languages, publishers }
}