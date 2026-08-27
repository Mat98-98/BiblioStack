import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios.js"
import { notify } from "@/lib/notify.js"
import { handleApiError } from "@/lib/handleApiError.js"
import { emptyWorkForm } from "./workForm.schema.js"

export function useAddWork() {
    const [step, setStep]               = useState("form");      // "form" | "conflicts"
    const [form, setForm]               = useState(emptyWorkForm);
    const [conflicts, setConflicts]     = useState([]);
    const [isbnLoading, setIsbnLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Stati per gestire l'apertura del dialog quando l'opera inserita tramite ISBN esiste già
    const [addItemOpen, setAddItemOpen]         = useState(false);
    const [confirmCopyOpen, setConfirmCopyOpen] = useState(false);
    const [addItemWork, setAddItemWork]         = useState(null);

    // Stato per il dialog che chiede se si vuole aggiungere una copia dopo l'inserimento di un'opera nuova
    const [askAddItemOpen, setAskAddItemOpen] = useState(false);


    const navigate = useNavigate();

    // Mapping delle lingue da ISO 639-1 a ISO 639-2
    const langMap = {
        it: "ita", en: "eng", fr: "fra",
        de: "deu", es: "spa", pt: "por",
    }

    // Ricerca dell'opera tramite codice ISBN
    const fetchByIsbn = async (isbn) => {
        if (!isbn.trim()) return;
        setIsbnLoading(true);
        try {
            const { data } = await api.get(`/works/lookup/${isbn.trim()}`);

            // Se l'opera è già presente nel database interno, apre il dialog per chiedere se aggiungere copie
            if (data.source === "internal") {
                setAddItemWork(data.work);
                setConfirmCopyOpen(true);
                return;
            }

            // Se l'opera non è nel db, compila automaticamente il form con i dati esterni
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

    // Conferma dell'avviso opera già presente dopo ricerca ISBN
    const handleConfirmAddCopy = async () => {
        setConfirmCopyOpen(false);
        setTimeout(() => setAddItemOpen(true), 150);
    };

    // Conferma del dialog che chiede se si vogliono aggiungere copie
    const handleConfirmAskAddItem = () => {
        setAskAddItemOpen(false);
        setTimeout(() => setAddItemOpen(true), 150);
    };

    // Rifiuto del dialog che chiede se si vogliono aggiungere copie associate all'opera
    const handleDeclineAskAddItem = () => {
        setAskAddItemOpen(false);
        navigate("/admin/works");
    };


    // Invio dei dati per la creazione di una nuova opera
    const submit = async (validatedData, resolvedAuthors = []) => {
        const payload = {
            ...(validatedData ?? form),
            resolvedAuthors,
        }

        setForm(payload);
        setSubmitLoading(true);
        try {
            const { data } = await api.post("/works/from-external", payload);
            notify.success("Opera aggiunta con successo");

            setAddItemWork(data);
            setStep("form");
            setConflicts([]);
            setAskAddItemOpen(true);
        } catch (err) {
            // Gestione dei conflitti sugli autori (es. autori omonimi)
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

    // Risoluzione dei conflitti sugli autori riprovando il submit
    const resolveConflicts = (resolutions) => submit(null, resolutions);

    // Ritorna allo step del form principale
    const backToForm = () => {
        setStep("form");
        setConflicts([]);
    };


    return {
        step,
        form,
        conflicts,
        isbnLoading,
        submitLoading,
        addItemOpen,
        addItemWork,
        confirmCopyOpen,
        askAddItemOpen,
        setAddItemOpen,
        setConfirmCopyOpen,
        fetchByIsbn,
        submit,
        resolveConflicts,
        backToForm,
        handleConfirmAddCopy,
        handleConfirmAskAddItem,
        handleDeclineAskAddItem
    }
}