import { useState, useEffect } from "react"
import api from "@/api/axios.js"
import { handleApiError } from "@/lib/handleApiError.js"
import { useNavigate } from "react-router-dom"

export function useWorks(endPoint) {
    const [works, setWorks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await api.get(endPoint)
                setWorks(res.data)
            } catch (err) {
                setError(err)
                handleApiError(err, navigate)
            } finally {
                setLoading(false)
            }
        }

        fetchWorks()
    }, [])

    return { works, loading, error }
}