import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";
import { addItemSchema } from "@/features/admin/items/addItem.schema.js";

export function useAddItem(workId, open) {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            id: "",
            locationId: null,
            currencyCode: null,
            acquisitionDate: new Date().toISOString().split("T")[0],
            price: null,
        }
    });

    useEffect(() => {
        if (!open) return;
        api.get("/locations")
            .then(({ data }) => setLocations(data))
            .catch(err => handleApiError(err, navigate));
    }, [open]);

    const submit = async (onSuccess) => {
        const values = form.getValues();
        setLoading(true);
        try {
            await api.post("/items", {
                ...values,
                workId,
                locationId: values.locationId || null,
                currencyCode: values.currencyCode || null,
                acquisitionDate: values.acquisitionDate || null,
                price: values.price ? parseFloat(values.price) : null,
            });

            notify.success("Copia aggiunta con successo!");

            // Reset pulito: resetta tutto tranne la data
            form.reset({
                id: "",
                locationId: null,
                currencyCode: null,
                acquisitionDate: new Date().toISOString().split("T")[0],
                price: null,
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

    return { form, loading, locations, submit };
}