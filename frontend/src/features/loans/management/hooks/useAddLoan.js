import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { addLoanSchema } from "@/features/loans/management/schemas/loan.schema.js";
import { handleApiError } from "@/lib/handleApiError.js";
import { notify } from "@/lib/notify.js";
import api from "@/api/axios.js";

// Calcolo data di scadenza default
function getDefaultDueDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);     // + 1 mese dalla data odierna
    return date.toISOString().split("T")[0];
}


export function useAddLoan(onSuccess) {
    const [loading, setLoading] = useState(false);

    // Stati per i chip inline
    const [patronInfo, setPatronInfo] = useState(null);
    const [patronLoading, setPatronLoading] = useState(false);
    const [itemInfo, setItemInfo] = useState(null);
    const [itemLoading, setItemLoading] = useState(false);

    // Stato per il dialog di riepilogo
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();

    const form = useForm({
        resolver: zodResolver(addLoanSchema),
        defaultValues: {
            userId: null,
            itemId: "",
            dueDate: getDefaultDueDate()
        }
    });

    const userIdValue = form.watch("userId");
    const itemIdValue = form.watch("itemId");

    // Fetch dati utente
    useEffect(() => {
        if (!userIdValue) {
            setPatronLoading(false);
            setPatronInfo(null);
            return;
        }

        const fetchPatron = async () => {
            setPatronLoading(true);
            try {
                const { data } = await api.get(`/users/${userIdValue}`);
                setPatronInfo({ valid: true, user: data });
            } catch (error) {
                setPatronInfo({ valid: false });
            } finally {
                setPatronLoading(false);
            }
        };

        // Debounce
        const timer = setTimeout(fetchPatron, 300);
        return () => clearTimeout(timer);
    }, [userIdValue]);


    // Fetch dati copia
    useEffect(() => {
        if (!itemIdValue) {
            setItemLoading(false);
            setItemInfo(null);
            return
        }

        const fetchItem = async () => {
            setItemLoading(true);
            try {
                const { data } = await api.get(`/items/${itemIdValue}`);
                setItemInfo({ valid: true, item: data });
            } catch (error) {
                setItemInfo({ valid: false });
            } finally {
                setItemLoading(false);
            }
        };

        // Debounce
        const timer = setTimeout(fetchItem, 500);
        return () => clearTimeout(timer);
    }, [itemIdValue]);

    // Intercetto il submit del form aprendo il dialog di riepilogo prima di salvare
    const handlePreSubmit = () => {
        setConfirmDialogOpen(true);
    };


    // Conferma finale
    const confirmAndSubmit = async () => {
        const values = form.getValues();
        setLoading(true);
        try {
            await api.post("/loans", {
                ...values,
                handledBy: user.id,
            });

            notify.success("Prestito registrato con successo!");
            form.reset({ userId: null, itemId: "", dueDate: getDefaultDueDate() });
            setPatronInfo(null);
            setItemInfo(null);
            setConfirmDialogOpen(false);
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
        form.reset();
        setItemInfo(null);
        setPatronInfo(null);
        setItemInfo(null);
        setConfirmDialogOpen(false);
    }

    return {
        form,
        loading,
        patronInfo,
        patronLoading,
        setPatronInfo,
        itemInfo,
        itemLoading,
        setItemLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        handlePreSubmit,
        confirmAndSubmit,
        resetAll
    };
}