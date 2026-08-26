import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeRoleSchema } from "./changeRole.schema.js";

export function useChangeRole(user) {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const form = useForm({
        resolver: zodResolver(changeRoleSchema),
        values: {
            role: user?.role?.name
        }
    });

    const { handleSubmit, watch, setValue, reset } = form;

    const role = watch("role");

    // Intercetta il submit e apre la conferma
    const handlePreSubmit = (data) => {
        setPendingData(data);
        setConfirmDialogOpen(true);
    };

    // Resetta tutto quando si chiude il dialog
    const resetAll = () => {
        setPendingData(null);
        setConfirmDialogOpen(false);
        reset({ role: user?.role?.name });
    };

    return {
        form,
        role,
        setValue,
        handleSubmit,
        handlePreSubmit,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        resetAll
    };
}