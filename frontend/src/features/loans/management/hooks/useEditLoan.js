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

    // Stati per il dialog di riepilogo
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(editLoanSchema),
        defaultValues: { dueDate: "", returnDate: null },
    });

    const formatDate = (dateVal) => {
        if (!dateVal) return null;
        try {
            return new Date(dateVal).toISOString().split("T")[0];
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (!loan || !open) return;
        form.reset({
            dueDate: formatDate(loan.dueDate),
            returnDate: formatDate(loan.returnDate),
        });
        setPendingData(null);
        setConfirmDialogOpen(false);
    }, [loan, open]);


    // Intercetta il submit del form, valida e apre il dialog di riepilogo
    const handlePreSubmit = async (values) => {
        setPendingData(values);
        setConfirmDialogOpen(true);
    };

    // Chiamata API finale dopo la conferma di riepilogo
    const handleConfirmFinal = async () => {
        if (!pendingData || !loan) return;
        setLoading(true);
        try {
            await api.patch(`/loans/${loan.id}`, pendingData);
            notify.success("Prestito aggiornato con successo!");
            resetAll();
            onSuccess?.();
            return true;
        } catch (err) {
            handleApiError(err, navigate);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetAll = () => {
        setPendingData(null);
        setConfirmDialogOpen(false);
    };


    return { form, loading, confirmDialogOpen, setConfirmDialogOpen, pendingData, handlePreSubmit, handleConfirmFinal, resetAll };
}