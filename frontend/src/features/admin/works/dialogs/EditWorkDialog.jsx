import { Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useEditWork } from "@/features/admin/works/dialogs/useEditWork.js";
import DeweyCombobox from "@/components/common/combobox/DeweyCombobox.jsx";
import LanguageCombobox from "@/components/common/combobox/LanguageCombobox.jsx";
import PublisherCombobox from "@/components/common/combobox/PublisherCombobox.jsx";

function FieldError({ message }) {
    if (!message) return null
    return <p className="text-xs text-destructive mt-1">{message}</p>
}

export default function EditWorkDialog({ work, open, onClose, onConfirm }) {
    const { form, loading, setLoading } = useEditWork(work, open)
    const { register, handleSubmit, control, formState: { errors } } = form

    const onSubmit = handleSubmit(async (data) => {
        if (!work) return
        setLoading(true)
        try {
            await onConfirm(work.id, {
                ...data,
                publisherId:           data.publisherId           ? Number(data.publisherId) : null,
                pages:                 data.pages                 || null,
                publicationDate:       data.publicationDate       || null,
                otherTitleInformation: data.otherTitleInformation || null,
                description:           data.description           || null,
                coverUrl:              data.coverUrl              || null,
                publicationCountry:    data.publicationCountry    || null,
            })
            onClose()
        } finally {
            setLoading(false)
        }
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl xl::min-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifica opera</DialogTitle>
                    <DialogDescription className="sr-only">
                        Modifica i dati dell'opera
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">

                    <div className="space-y-1.5">
                        <Label>Titolo *</Label>
                        <Input {...register("title")} />
                        <FieldError message={errors.title?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Informazioni aggiuntive</Label>
                        <Input {...register("otherTitleInformation")} />
                        <FieldError message={errors.otherTitleInformation?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Descrizione</Label>
                        <Textarea rows={4} className="resize-none" {...register("description")} />
                        <FieldError message={errors.description?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Pagine</Label>
                            <Input type="number" {...register("pages")} />
                            <FieldError message={errors.pages?.message} />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Paese pubblicazione</Label>
                            <Input {...register("publicationCountry")} maxLength={2} placeholder="IT" />
                            <FieldError message={errors.publicationCountry?.message} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Data pubblicazione</Label>
                        <Input type="date" {...register("publicationDate")} />
                        <FieldError message={errors.publicationDate?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Editore</Label>
                        <Controller
                            name="publisherId"
                            control={control}
                            render={({ field }) => (
                                <PublisherCombobox value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <FieldError message={errors.publisherId?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Lingua</Label>
                        <Controller
                            name="languageCode"
                            control={control}
                            render={({ field }) => (
                                <LanguageCombobox value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <FieldError message={errors.languageCode?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Codice Dewey</Label>
                        <Controller
                            name="deweyCode"
                            control={control}
                            render={({ field }) => (
                                <DeweyCombobox value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <FieldError message={errors.deweyCode?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Cover URL</Label>
                        <Input {...register("coverUrl")} placeholder="https://..." />
                        <FieldError message={errors.coverUrl?.message} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annulla
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</>
                                : "Salva modifiche"
                            }
                        </Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )
}