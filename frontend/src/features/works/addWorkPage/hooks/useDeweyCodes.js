import { useState, useEffect } from "react"
import api from "@/api/axios.js"

export function useDeweyCodes() {
    const [codes, setCodes] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        api.get("/deweyCodes", { params: { limit: 1000 } })
            .then(r => setCodes(r.data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    return { codes, loading }
}