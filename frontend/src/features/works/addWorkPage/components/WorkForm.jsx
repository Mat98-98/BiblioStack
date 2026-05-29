import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx"

import DeweyCombobox from "./DeweyCombobox"
import FormField from "./FormField.jsx"
import AuthorsField from "./AuthorsField"
import GenresField from "./GenresField.jsx"
import { useGenres } from "../hooks/useGenres"
import { useDeweyCodes } from "../hooks/useDeweyCodes"
import { workFormSchema } from "../workForm.schema"

export default function WorkForm({ form: externalForm, onSubmit, loading }) {
    const genres    = useGenres()
    const deweyCodes = useDeweyCodes()

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(workFormSchema),
        values:   externalForm,
    })

    const coverUrl = watch("coverUrl")

    const handleValidSubmit = (data) => {
        onSubmit({
            ...data,
            pages:           data.pages           || null,
            publicationDate: data.publicationDate || null,
            coverUrl:        data.coverUrl        || null,
        })
    }

    return (
        <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-6">

            {coverUrl && (
                <div className="flex justify-center">
                    <img src={coverUrl} alt="Cover" className="h-40 rounded-xl object-cover shadow" />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField label="ISBN *" error={errors.isbn?.message}>
                    <Input {...register("isbn")} placeholder="es. 9788884516107" />
                </FormField>

                <FormField label="Titolo *" error={errors.title?.message}>
                    <Input {...register("title")} />
                </FormField>

                <FormField label="Sottotitolo" error={errors.subtitle?.message}>
                    <Input {...register("subtitle")} />
                </FormField>

                <FormField label="Editore" error={errors.publisherName?.message}>
                    <Input {...register("publisherName")} />
                </FormField>

                <FormField label="Data di pubblicazione" error={errors.publicationDate?.message}>
                    <Input type="date" {...register("publicationDate")} />
                </FormField>

                <FormField label="Pagine" error={errors.pages?.message}>
                    <Input type="number" {...register("pages")} />
                </FormField>

                <FormField label="Lingua (3 lettere)" error={errors.languageCode?.message}>
                    <Input {...register("languageCode")} maxLength={3} placeholder="ita" />
                </FormField>

                <FormField label="Paese pubblicazione (2 lettere)" error={errors.publicationCountry?.message}>
                    <Input {...register("publicationCountry")} maxLength={2} placeholder="IT" />
                </FormField>

                <FormField label="Codice Dewey" error={errors.deweyCode?.message}>
                    <Controller
                        name="deweyCode"
                        control={control}
                        render={({ field }) => (
                            <DeweyCombobox value={field.value ?? ""} onChange={field.onChange} />
                        )}
                    />
                </FormField>

                <FormField label="URL copertina" error={errors.coverUrl?.message}>
                    <Input {...register("coverUrl")} type="url" placeholder="https://..." />
                </FormField>

            </div>

            <FormField label="Descrizione" error={errors.description?.message}>
                <Textarea {...register("description")} rows={4} className="resize-none" />
            </FormField>

            <Controller
                name="authors"
                control={control}
                render={({ field }) => (
                    <AuthorsField
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.authors?.message}
                    />
                )}
            />

            <Controller
                name="genreIds"
                control={control}
                render={({ field }) => (
                    <GenresField
                        value={field.value}
                        onChange={field.onChange}
                        genres={genres}
                    />
                )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
                {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</>
                    : "Aggiungi opera"
                }
            </Button>

        </form>
    )
}