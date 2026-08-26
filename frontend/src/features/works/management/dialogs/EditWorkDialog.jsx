import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import { BookOpen, Calendar, Globe, Hash, Bookmark } from "lucide-react";
import { Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useEditWork } from "@/features/works/management/dialogs/useEditWork.js";
import { useDeweyCodes } from "@/features/works/hooks/useDeweyCodes.js";
import { useLanguages } from "@/features/works/hooks/useLanguages.js";
import { usePublishers } from "@/features/works/hooks/usePublishers.js";
import { usePublicationCountries } from "@/features/works/hooks/usePublicationCountries.js";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { safeFormat } from "@/lib/dateUtils.js";
import AppCombobox from "@/components/common/AppCombobox.jsx";
import DateSelector from "@/components/common/DateSelector.jsx";
import FormField from "@/features/works/management/addWorkPage/components/FormField.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";




export default function EditWorkDialog({ work, open, onClose, onConfirm }) {
    const {
        form,
        loading,
        setLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        resetAll
    } = useEditWork(work, open);

    const navigate = useNavigate();

    const { register, handleSubmit, control, formState: { errors } } = form;

    const { codes: deweyCodes, loading: loadingDewey } = useDeweyCodes();
    const { languages, loading: loadingLanguages } = useLanguages();
    const { publishers, loading: loadingPublishers } = usePublishers();
    const { publicationCountries, loading: loadingPublicationCountries } = usePublicationCountries();

    const onSubmit = handleSubmit(handlePreSubmit);

    const handleConfirmFinal = async () => {
        if (!work || !pendingData) return;
        setLoading(true);
        try {
            await onConfirm(work.id, {
                ...pendingData,
                publisherId:           pendingData.publisherId           ? Number(pendingData.publisherId) : null,
                pages:                 pendingData.pages                 || null,
                publicationDate:       pendingData.publicationDate       || null,
                otherTitleInformation: pendingData.otherTitleInformation || null,
                description:           pendingData.description           || null,
                coverUrl:              pendingData.coverUrl              || null,
                publicationCountry:    pendingData.publicationCountry    || null,
            });
            resetAll();
            onClose();
        } catch (error){
            handleApiError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

    const handleFullClose = () => {
        if (loading) return;
        resetAll();
        onClose();
    };

    return (
        <>
            {/* Dialog del Form */}
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="sm:max-w-2xl xl:min-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Modifica opera</DialogTitle>
                        <DialogDescription className="sr-only">
                            Modifica i dati dell'opera
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4 py-2">

                        <FormField label="Titolo *" error={errors.title?.message}>
                            <Input {...register("title")} />
                        </FormField>

                        <FormField label="Informazioni aggiuntive" error={errors.otherTitleInformation?.message}>
                            <Input {...register("otherTitleInformation")} />
                        </FormField>

                        <FormField label="Descrizione" error={errors.description?.message}>
                            <Textarea rows={4} className="resize-none" {...register("description")} />
                        </FormField>

                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Pagine" error={errors.pages?.message}>
                                <Input type="number" {...register("pages")} />
                            </FormField>

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
                        </div>

                        <FormField label="Data pubblicazione" error={errors.publicationDate?.message}>
                            <Controller
                                name="publicationDate"
                                control={control}
                                render={({ field }) => (
                                    <DateSelector
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        placeholder="Seleziona data pubblicazione"
                                        captionLayout={"dropdown"}
                                        startYear={1800}
                                        endYear={new Date().getFullYear()}
                                    />
                                )}
                            />
                        </FormField>

                        <FormField label="Editore" error={errors.publisherId?.message}>
                            <Controller
                                name="publisherId"
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

                        <FormField label="Cover URL" error={errors.coverUrl?.message}>
                            <Input {...register("coverUrl")} placeholder="https://..." />
                        </FormField>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={handleFullClose} disabled={loading}>
                                Annulla
                            </Button>
                            <Button type="submit" disabled={loading}>
                                Avanti
                            </Button>
                        </DialogFooter>

                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog di Riepilogo Finale */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => { if (!loading) setConfirmDialogOpen(false); }}
                onConfirm={handleConfirmFinal}
                title="Conferma modifiche opera"
                description={`Sei sicuro di voler salvare le modifiche per l'opera "${work?.title}"?`}
                confirmLabel="Salva modifiche"
                cancelLabel="Indietro"
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={BookOpen}
                        label="Titolo"
                        value={pendingData?.title}
                    />
                    <SummaryRow
                        icon={Hash}
                        label="Pagine"
                        value={pendingData?.pages}
                    />
                    <SummaryRow
                        icon={Calendar}
                        label="Data di pubblicazione"
                        value={safeFormat(pendingData?.publicationDate) || "Non definita"}
                    />
                    <SummaryRow
                        icon={Globe}
                        label="Paese"
                        value={pendingData?.publicationCountry}
                    />
                    <SummaryRow
                        icon={Bookmark}
                        label="Codice Dewey"
                        value={pendingData?.deweyCode}
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}