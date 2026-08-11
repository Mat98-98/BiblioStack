import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";
import { addItemSchema } from "@/features/admin/items/addItem.schema.js";


export function useAddItem(workId, open) {
    const [loading, setLoading]     = useState(false);
    const [locations, setLocations] = useState([]);

    const navigate = useNavigate();

    // Inizializzazione del form con react hook e validazione zod
    const form = useForm({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            id:              "",
            locationId:      null,
            currencyCode:    null,
            acquisitionDate: new Date().toISOString().split("T")[0],
            price:           null,
        }
    });

    // Lazy loading elle posizioni (solo all'apertura del dialog)
    useEffect(() => {
        if (!open) return;

        const fetchLocations = async () => {
            try {
                const { data } = await api.get("/locations");
                setLocations(data);
            } catch (err) {
                handleApiError(err, navigate);
            }
        };

        fetchLocations();
    }, [open]);

    // Gestione della chiamata API di creazione con sanitizzazione dei campi opzionali
    const submit = async (onSuccess) => {
        const valid = await form.trigger();
        if (!valid) return false;

        const values = form.getValues();

        setLoading(true);
        try {
            await api.post("/items", {
                ...values,
                workId,
                locationId:      values.locationId      || null,
                currencyCode:    values.currencyCode    || null,
                acquisitionDate: values.acquisitionDate || null,
                price:           values.price           || null,
            });
            notify.success("Copia aggiunta con successo!");
            form.reset({
                id:              "",
                locationId:      null,
                currencyCode:    null,
                acquisitionDate: new Date().toISOString().split("T")[0],
                price:           null,
            });
            onSuccess?.();
            return true;
        } catch (err) {
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        locations,
        submit,
    };
}