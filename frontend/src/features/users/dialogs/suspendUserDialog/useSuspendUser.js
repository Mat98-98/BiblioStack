import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { suspendUserSchema } from "@/features/users/dialogs/suspendUserDialog/suspendUser.schema.js";

export function useSuspendUser() {
    const [loading, setLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const form = useForm({
        resolver: zodResolver(suspendUserSchema),
        defaultValues: {
            reason: "",
            endDate: "",
        }
    });

    const handlePreSubmit = (data) => {
        setPendingData({
            reason: data.reason || null,
            endDate: data.endDate || null,
        });
        setConfirmDialogOpen(true);
    };

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