import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema } from "@/features/users/management/dialogs/editUserDialog/editUser.schema.js";
import api from "@/api/axios.js";

export function useEditUser(user, open) {
    const [loading, setLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const form = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: "",
            lastName:  "",
            email:     "",
            phone:     "",
        }
    });

    // Fetch dati utente
    useEffect(() => {
        if (!open || !user?.id) {
            return;
        }

        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/users/${user.id}`);

                form.reset({
                    firstName: data.firstName ?? "",
                    lastName:  data.lastName  ?? "",
                    email:     data.email     ?? "",
                    phone:     data.phone     ?? "",
                });
            } catch (error) {}
        };

        fetchUser();
    }, [user?.id, open]);

    // Intercetta il submit del form e apre il dialog di riepilogo
    const handlePreSubmit = (data) => {
        setPendingData({
            ...data,
            phone: data.phone || null
        });
        setConfirmDialogOpen(true);
    };

    // Resetta tutto quando si chiude
    const resetAll = () => {
        setPendingData(null);
        setConfirmDialogOpen(false);
    };

    return {
        form,
        loading,
        setLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        resetAll
    };
}