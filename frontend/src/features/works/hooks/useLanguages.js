import { useState, useEffect } from "react";
import api from "@/api/axios.js";

export function useLanguages() {
    const [languages, setLanguages] = useState([])
    const [loading, setLoading]     = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await api.get("/languages", { params: { limit: 100 } })
                setLanguages(data)
            } catch {}
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return { languages, loading }
}