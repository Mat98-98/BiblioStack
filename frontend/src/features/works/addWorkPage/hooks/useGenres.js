import { useState, useEffect } from "react"
import api from "@/api/axios.js"

export function useGenres() {
    const [genres, setGenres] = useState([])

    useEffect(() => {
        api.get("/genres?limit=100")
            .then(r => setGenres(r.data))
            .catch(() => {})
    }, [])

    return genres
}