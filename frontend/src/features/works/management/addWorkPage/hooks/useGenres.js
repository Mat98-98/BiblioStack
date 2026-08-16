import { useState, useEffect } from "react"
import api from "@/api/axios.js"

export function useGenres() {
    const [genres, setGenres]     = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await api.get("/genres", { params: { limit: 1000 } })
                setGenres(data)
            } catch {}
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return { genres, loading }
}