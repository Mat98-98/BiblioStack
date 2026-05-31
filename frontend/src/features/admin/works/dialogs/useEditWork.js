import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {editWorkSchema} from "@/features/admin/works/dialogs/editWork.schema.js";
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
        publicationCountry:    data.publicationCountry    ?? "",
        languageCode:          data.language?.languageCode ?? "",
        deweyCode:             data.dewey?.code            ?? "",
        publisherId:           data.publisher?.id?.toString() ?? "",
        coverUrl:              data.coverUrl               ?? "",
    }
}

export function useEditWork(work, open) {
    const [loading, setLoading] = useState(false)

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
    })

    useEffect(() => {
        if (!open || !work?.id) return
        let cancelled = false

        const fetchWork = async () => {
            try {
                const { data } = await api.get(`/works/${work.id}`);

                form.reset(mapWorkToForm(data));
            } catch (error) {}
        }
            /*
        api.get(`/works/${work.id}`)
            .then(({ data }) => {
                if (!cancelled) form.reset(mapWorkToForm(data))
            })
            .catch(() => {})

        return () => { cancelled = true }

             */
        fetchWork()
    }, [work?.id, open])

    return { form, loading, setLoading }
}