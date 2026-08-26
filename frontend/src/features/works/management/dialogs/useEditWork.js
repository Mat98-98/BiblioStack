import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleApiError } from "@/lib/handleApiError.js";
import { editWorkSchema } from "@/features/works/management/dialogs/editWork.schema.js";
import api from "@/api/axios.js";


function mapWorkToForm(data) {
    return {
        title:                 data.title                 ?? "",
        otherTitleInformation: data.otherTitleInformation ?? "",
        description:           data.description           ?? "",
        pages:                 data.pages                 ?? "",
        publicationDate:       data.publicationDate
            ? new Date(data.publicationDate).toISOString().split("T")[0]
            : "",
        publicationCountry:    data.country?.countryCode    ?? "",
        languageCode:          data.language?.languageCode ?? "",
        deweyCode:             data.dewey?.code            ?? "",
        publisherId:           data.publisher?.id?.toString() ?? "",
        coverUrl:              data.coverUrl               ?? "",
    }
}

export function useEditWork(work, open) {
    const [loading, setLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(editWorkSchema),
        defaultValues: {
            title:                 "",
            otherTitleInformation: "",
            description:           "",
            pages:                 "",
            publicationDate:       "",
            publicationCountry:    "",
            languageCode:          "",
            deweyCode:             "",
            publisherId:           "",
            coverUrl:              "",
        }
    });

    useEffect(() => {
        if (!open || !work?.id) return;

        const fetchWork = async () => {
            try {
                const { data } = await api.get(`/works/${work.id}`);
                form.reset(mapWorkToForm(data));
            } catch (error) {
                handleApiError(error, navigate)
            }
        };
        fetchWork();
        setPendingData(null);
        setConfirmDialogOpen(false);
    }, [work?.id, open]);

    // Intercetta il submit, valida e apre il riepilogo
    const handlePreSubmit = async (values) => {
        const valid = await form.trigger();
        if (!valid) return;

        setPendingData(values);
        setConfirmDialogOpen(true);
    };


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