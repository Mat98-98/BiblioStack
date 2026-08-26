import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/features/users/dialogs/createUserDialog/createUser.schema.js";

export function useCreateUser() {
    const [loading, setLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            firstName: "",
            lastName:  "",
            email:     "",
            phone:     ""
        }
    });

    // Intercetta il submit del form e apre il dialog di riepilogo
    const handlePreSubmit = (data) => {
        setPendingData({
            ...data,
            phone: data.phone || null
        });
        setConfirmDialogOpen(true);
    };

    // Resetta tutto lo stato
    const resetAll = () => {
        form.reset();
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