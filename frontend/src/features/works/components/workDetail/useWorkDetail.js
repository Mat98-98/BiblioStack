import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios.js"
import { handleApiError } from "@/lib/handleApiError.js"

export function useWorkDetail(id) {
    const [work, setWork] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) return
        setLoading(true)
        api.get(`/works/${id}`)
            .then(r => setWork(r.data))
            .catch(err => {
                setError(err)
                handleApiError(err, navigate)
            })
            .finally(() => setLoading(false))
    }, [id])

    return { work, loading, error }
}