import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios.js"
import { handleApiError } from "@/lib/handleApiError.js"

// Hook che recupera i dati di una singola opera
export function useWorkDetail(id) {
    const [work, setWork] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    // Estratta fuori dall'effect così può essere richiamata anche da refetch
    const fetchWork = useCallback(async (signal) => {
        setLoading(true)
        setError(null)

        try {
            // HTTP request
            const res = await api.get(`/works/${id}`, { signal })

            // Salva risultato
            setWork(res.data)

        } catch (err) {
            // Ignora abort se la richiesta è cancellata
            if (err.name === "CanceledError" || err.name === "AbortError") return

            setError(err)
            handleApiError(err, navigate)

        } finally {
            setLoading(false)
        }
    }, [id, navigate])

    useEffect(() => {
        if (!id) return
        // Abort controller cancella la request se cambia id o unmount
        const controller = new AbortController()

        fetchWork(controller.signal)

        // Cancella request in corso
        return () => controller.abort()
    }, [id, fetchWork])

    // Permette di ricaricare i dati senza cambiare id (es. dopo modifica/eliminazione item)
    const refetch = useCallback(() => fetchWork(), [fetchWork])

    return { work, loading, error, refetch }
}