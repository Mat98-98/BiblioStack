import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios.js"
import { notify } from "@/lib/notify.js"
import { handleApiError } from "@/lib/handleApiError.js"
import { emptyWorkForm } from "./workForm.schema"

export function useAddWork() {
    const [step, setStep]               = useState("form")      // "form" | "conflicts"
    const [form, setForm]               = useState(emptyWorkForm)
    const [conflicts, setConflicts]     = useState([])
    const [isbnLoading, setIsbnLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    const navigate = useNavigate()

    // mapping lingua da ISO 639-1 a ISO 639-2
    const langMap = {
        it: "ita", en: "eng", fr: "fra",
        de: "deu", es: "spa", pt: "por",
    }
    // Chiamata alle api esterne per recuperare i dati dell'opera
    const fetchByIsbn = async (isbn) => {
        if (!isbn.trim()) return
        setIsbnLoading(true)
        try {
            const { data } = await api.get(`/works-external/isbn/${isbn.trim()}`)
            setForm(prev => ({
                ...prev,
                isbn:            data.isbn            ?? isbn,
                title:           data.title           ?? "",
                subtitle:        data.subtitle        ?? "",
                description:     data.description     ?? "",
                publicationDate: data.publicationDate ?? "",
                publisherName:   data.publishers?.[0] ?? "",
                authors:         data.authors         ?? [],
                pages:           data.pages           || "",
                languageCode:    langMap[data.language] ?? data.language ?? "",
                coverUrl:        data.coverUrl        ?? "",
            }))
            notify.success("Dati recuperati")
        } catch {
            setForm(prev => ({ ...prev, isbn: isbn.trim() }))
            notify.error("ISBN non trovato — compila il form manualmente")
        } finally {
            setIsbnLoading(false)
        }
    }

    const submit = async (validatedData, resolvedAuthors = []) => {
        const payload = {
            ...(validatedData ?? form),
            resolvedAuthors,
        }

        setForm(payload)
        setSubmitLoading(true)
        try {
            await api.post("/works/from-external", payload)
            notify.success("Opera aggiunta con successo")
            navigate("/admin/works")

        } catch (err) {
            if (err.response?.status === 409) {
                setConflicts(err.response.data.details)
                setStep("conflicts")
            } else {
                handleApiError(err, navigate)
            }
        } finally {
            setSubmitLoading(false)
        }
    }

    // Risolvo i conflitti
    // @todo: Aggiungere step per inserimento copie / redirect pagina inserimento copie
    const resolveConflicts = (resolutions) => submit(null, resolutions)

    const backToForm = () => {
        setStep("form")
        setConflicts([])
    }

    return {
        step,
        form,
        conflicts,
        isbnLoading,
        submitLoading,
        fetchByIsbn,
        submit,
        resolveConflicts,
        backToForm,
    }
}