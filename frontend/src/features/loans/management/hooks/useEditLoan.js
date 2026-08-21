import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { editLoanSchema } from "@/features/loans/management/schemas/loan.schema.js";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import api from "@/api/axios.js";


export function useEditLoan(loan, open, onSuccess) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(editLoanSchema),
        defaultValues: { dueDate: "", returnDate: null },
    });

    useEffect(() => {
        if (!loan || !open) return;
        form.reset({
            dueDate: loan.dueDate ? new Date(loan.dueDate).toISOString().split("T")[0] : "",
            returnDate: loan.returnDate ? new Date(loan.returnDate).toISOString().split("T")[0] : null,
        });
    }, [loan, open]);

    const submit = async () => {
        const values = form.getValues();
        setLoading(true);
        try {
            await api.patch(`/loans/${loan.id}`, values);
            notify.success("Prestito aggiornato con successo!");
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