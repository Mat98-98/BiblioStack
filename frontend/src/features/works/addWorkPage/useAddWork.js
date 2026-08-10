/*import { useState } from "react"
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
        if (!isbn.trim()) return;
        setIsbnLoading(true);
        try {
            const { data } = await api.get(`/works/lookup/${isbn.trim()}`);

            // Se l'opera è già nel db redirect alla pagina per aggiungere copie
            if (data.source === "internal") {
                notify.info("Opera già presente nel catalogo.");
                navigate(`/admin/users`);
                return;
            }

            // Se la fonte è esterna compila il form con i dati recuperati
            const d = data.work;
            setForm(prev => ({
                ...prev,
                isbn:            d.isbn            ?? isbn,
                title:           d.title           ?? "",
                subtitle:        d.subtitle        ?? "",
                description:     d.description     ?? "",
                publicationDate: d.publicationDate ?? "",
                publisherName:   d.publishers?.[0] ?? "",
                authors:         d.authors         ?? [],
                pages:           d.pages           || "",
                languageCode:    langMap[d.language] ?? d.language ?? "",
                coverUrl:        d.coverUrl        ?? "",
            }));
            notify.success("Dati recuperati");

        } catch {
            setForm(prev => ({ ...prev, isbn: isbn.trim() }));
            notify.error("ISBN non trovato — compila il form manualmente");
        } finally {
            setIsbnLoading(false);
        }
    };

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

 */

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
    const [addItemOpen, setAddItemOpen]     = useState(false)   // controlla visibilità dialog
    const [addItemWorkId, setAddItemWorkId] = useState(null)    // id opera da passare al dialog

    const navigate = useNavigate()

    // mapping lingua da ISO 639-1 a ISO 639-2
    const langMap = {
        it: "ita", en: "eng", fr: "fra",
        de: "deu", es: "spa", pt: "por",
    }

    const fetchByIsbn = async (isbn) => {
        if (!isbn.trim()) return;
        setIsbnLoading(true);
        try {
            const { data } = await api.get(`/works/lookup/${isbn.trim()}`);

            if (data.source === "internal") {
                // Opera già nel db → apre il dialog per aggiungere copie
                notify.info("Opera già presente nel catalogo.");
                setAddItemWorkId(data.work.id);
                setAddItemOpen(true);
                return;
            }

            // Opera non nel db → compila il form con i dati esterni
            const d = data.work;
            setForm(prev => ({
                ...prev,
                isbn:            d.isbn            ?? isbn,
                title:           d.title           ?? "",
                subtitle:        d.subtitle        ?? "",
                description:     d.description     ?? "",
                publicationDate: d.publicationDate ?? "",
                publisherName:   d.publishers?.[0] ?? "",
                authors:         d.authors         ?? [],
                pages:           d.pages           || "",
                languageCode:    langMap[d.language] ?? d.language ?? "",
                coverUrl:        d.coverUrl        ?? "",
            }));
            notify.success("Dati recuperati");

        } catch {
            setForm(prev => ({ ...prev, isbn: isbn.trim() }));
            notify.error("ISBN non trovato — compila il form manualmente");
        } finally {
            setIsbnLoading(false);
        }
    };

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
        addItemOpen,
        addItemWorkId,
        setAddItemOpen,
        fetchByIsbn,
        submit,
        resolveConflicts,
        backToForm,
    }
}