import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoticeSchema } from "@/features/notices/schema/notice.schema.js";


export function useCreateNotice() {
    const [loading, setLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const form = useForm({
        resolver: zodResolver(createNoticeSchema),
        defaultValues: {
            noticeTypeId: "",
            description: "",
        }
    });

    const handlePreSubmit = (data) => {
        setPendingData(data);
        setConfirmDialogOpen(true);
    };

    const resetAll = () => {
        form.reset();
        setPendingData(null);
        setConfirmDialogOpen(false);
    };

    return {
        form, loading, setLoading,
        confirmDialogOpen, setConfirmDialogOpen,
        pendingData, handlePreSubmit, resetAll
    };
}