import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useDeweyCodes } from "@/features/works/hooks/useDeweyCodes.js";
import { useLanguages } from "@/features/works/hooks/useLanguages.js";
import { usePublishers } from "@/features/works/hooks/usePublishers.js";
import { usePublicationCountries } from "@/features/works/hooks/usePublicationCountries.js";
import { workFormSchema } from "@/features/works/management/addWorkPage/workForm.schema.js";
import { useGenres } from "@/features/works/management/addWorkPage/hooks/useGenres.js";
import FormField from "@/features/works/management/addWorkPage/components/FormField.jsx";
import GenresField from "@/features/works/management/addWorkPage/components/GenresField.jsx";
import AuthorsField from "@/features/works/management/addWorkPage/components/AuthorsField.jsx";
import AppCombobox from "@/components/common/AppCombobox.jsx";
import DateSelector from "@/components/common/DateSelector.jsx";

export default function WorkForm({ form: externalForm, onSubmit, loading }) {
    const { genres } = useGenres()
    const { codes: deweyCodes, loading: loadingDewey } = useDeweyCodes()
    const { languages, loading: loadingLanguages } = useLanguages()
    const { publishers, loading: loadingPublishers } = usePublishers()

    // Corretto mappando le variabili corrette dall'hook
    const { publicationCountries, loading: loadingPublicationCountries } = usePublicationCountries()

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(workFormSchema),
        values: externalForm,
    })

    const coverUrl = watch("coverUrl")

    const handleValidSubmit = (data) => {
        onSubmit({
            ...data,
            pages:              data.pages              || null,
            publicationDate:    data.publicationDate    || null,
            coverUrl:           data.coverUrl           || null,
            publicationCountry: data.publicationCountry?.trim().toLowerCase() || null,
            languageCode:       data.languageCode       || null,
            deweyCode:          data.deweyCode          || null,
            subtitle:           data.subtitle           || null,
            description:        data.description        || null,
            publisherName:      data.publisherName      || null,
        })
    }

    return (
        <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-6">

            {coverUrl && (
                <div className="flex justify-center">
                    <img src={coverUrl} alt="Cover" className="h-40 rounded-xl object-cover shadow" />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">

                <FormField label="ISBN *" error={errors.isbn?.message}>
                    <Input {...register("isbn")} />
                </FormField>

                <FormField label="Titolo *" error={errors.title?.message}>
                    <Input {...register("title")} />
                </FormField>

                <FormField label="Sottotitolo" error={errors.subtitle?.message}>
                    <Input {...register("subtitle")} />
                </FormField>

                {/* Editore */}
                <FormField label="Editore" error={errors.publisherName?.message}>
                    <Controller
                        name="publisherName"
                        control={control}
                        render={({ field }) => (
                            <AppCombobox
                                value={field.value ? Number(field.value) : ""}
                                onChange={(val) => field.onChange(val ? String(val) : "")}
                                items={publishers}
                                loading={loadingPublishers}
                                placeholder="Seleziona editore..."
                                searchPlaceholder="Cerca editore..."
                                getOptionValue={(p) => p.id}
                                renderLabel={(p) => <span className="text-sm">{p.name}</span>}
                                renderSelected={(p) => p.name}
                            />
                        )}
                    />
                </FormField>

                {/* Data di pubblicazione */}
                <FormField label="Data di pubblicazione" error={errors.publicationDate?.message}>
                    <Controller
                        name="publicationDate"
                        control={control}
                        render={({ field }) => (
                            <DateSelector
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Seleziona data di pubblicazione"
                                captionLayout={"dropdown"}
                                startYear={1800}
                                endYear={new Date().getFullYear()}
                            />
                        )}
                    />
                </FormField>

                <FormField label="Pagine" error={errors.pages?.message}>
                    <Input type="number" inputMode="numeric" {...register("pages")} />
                </FormField>

                {/* Lingua */}
                <FormField label="Lingua" error={errors.languageCode?.message}>
                    <Controller
                        name="languageCode"
                        control={control}
                        render={({ field }) => (
                            <AppCombobox
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                items={languages}
                                loading={loadingLanguages}
                                placeholder="Seleziona lingua..."
                                searchPlaceholder="Cerca lingua..."
                                getOptionValue={(l) => l.languageCode}
                                renderLabel={(l) => (
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-sm">{l.name}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{l.languageCode}</span>
                                    </div>
                                )}
                                renderSelected={(l) => l.name}
                            />
                        )}
                    />
                </FormField>

                {/* Paese pubblicazione dinamico da API */}
                <FormField label="Paese pubblicazione" error={errors.publicationCountry?.message}>
                    <Controller
                        name="publicationCountry"
                        control={control}
                        render={({ field }) => (
                            <AppCombobox
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                items={publicationCountries}
                                loading={loadingPublicationCountries}
                                placeholder="Seleziona paese..."
                                searchPlaceholder="Cerca paese..."
                                getOptionValue={(c) => c.countryCode}
                                renderLabel={(c) => (
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-sm">{c.name}</span>
                                        <span className="ml-auto text-xs text-muted-foreground uppercase">{c.countryCode}</span>
                                    </div>
                                )}
                                renderSelected={(c) => c.name}
                            />
                        )}
                    />
                </FormField>

                {/* Codice Dewey */}
                <FormField label="Codice Dewey" error={errors.deweyCode?.message}>
                    <Controller
                        name="deweyCode"
                        control={control}
                        render={({ field }) => (
                            <AppCombobox
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                items={deweyCodes}
                                loading={loadingDewey}
                                placeholder="Seleziona codice Dewey..."
                                searchPlaceholder="Cerca codice o descrizione..."
                                getOptionValue={(d) => d.code}
                                renderLabel={(d) => (
                                    <div className="flex items-center">
                                        <span className="font-mono text-sm mr-2">{d.code}</span>
                                        <span className="text-muted-foreground text-sm truncate">{d.description}</span>
                                    </div>
                                )}
                                renderSelected={(d) => `${d.code} — ${d.description}`}
                            />
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