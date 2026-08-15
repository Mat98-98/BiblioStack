// features/admin/items/hooks/useEditItem.js
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";
import { editItemSchema } from "@/features/works/workDetail/editItem.schema.js";

export function useEditItem(item, open, onSuccess) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(editItemSchema),
        defaultValues: {
            locationId: null,
            currencyCode: null,
            acquisitionDate: null,
            price: null,
        },
    });

    // Ripopola il form ogni volta che il dialog si apre su un item diverso
    useEffect(() => {
        if (!item || !open) return;
        form.reset({
            locationId: item.location?.id ?? null,
            currencyCode: item.currencyCode ?? null,
            acquisitionDate: item.acquisitionDate
                ? new Date(item.acquisitionDate).toISOString().split("T")[0]
                : null,
            price: item.price ?? null,
        });
    }, [item, open]);

    const submit = async () => {
        const values = form.getValues();
        setLoading(true);
        try {
            await api.patch(`/items/${item.id}`, {
                ...values,
                price: values.price ? parseFloat(values.price) : null,
            });

            notify.success("Copia aggiornata con successo!");
            onSuccess?.();
            return true;
        } catch (err) {
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, submit };
}