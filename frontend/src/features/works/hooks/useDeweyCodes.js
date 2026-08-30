import { useState, useEffect } from "react";
import api from "@/api/axios.js";

export function useDeweyCodes() {
    const [codes, setCodes]     = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await api.get("/dewey-codes", { params: { limit: 1000 } })
                setCodes(data)
            } catch {}
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return { codes, loading }
}