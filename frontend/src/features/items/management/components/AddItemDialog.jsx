import { useState } from 'react';
import { Controller } from "react-hook-form";
import { Loader2, Hash, MapPin, Calendar, Euro } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { useAddItem } from "@/features/items/management/hooks/useAddItem.js";
import { ConfirmDialogContent } from "@/components/common/dialogs/ConfirmDialog.jsx";
import { format } from "date-fns";
import { it } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog.jsx";
import LocationSelect from "@/features/items/management/components/LocationSelect.jsx";
import DateSelector from "@/components/common/DateSelector.jsx";


function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-xs text-destructive mt-1">{message}</p>;
}


export default function AddItemDialog({ open, onClose, onSuccess, workId, workTitle }) {
    const { form, loading, locations, submit } = useAddItem(workId, open);

    // Fasi del dialog
    const [phase, setPhase] = useState("form");

    const { register, control, watch, formState: { errors } } = form;

    // Valida il form e se ok apre il riepilogo
    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = await form.trigger();
        if (!valid) return;
        setPhase("confirm");
    };

    // Esegue il salvataggio dopo la conferma del riepilogo
    const handleConfirm = async () => {
        const ok = await submit(onSuccess);
        if (ok) {
            setPhase("again")
        }
    };

    // Reset completo dello stato e chiusura totale
    const handleClose = () => {
        form.reset();
        setPhase("form");
        onClose();
    };

    // Aggiunta di altre copie
    const handleAddAnother = () => setPhase("form");

    // Build dei dati per il dialog di riepilogo
    const locationId = watch("locationId");
    const summaryData = {
        id:              watch("id"),
        acquisitionDate: watch("acquisitionDate"),
        price:           watch("price"),
        locationLabel:   locations.find(l => l.id === locationId)?.shelfCode
            ?? (locationId ? `Scaffale ${locationId}` : null),
    };

    return (
        <Dialog open={open} onOpenChange={ (v) => { if (!v) handleClose(); }}>
            <DialogContent className="max-w-md">

                {phase === "form" && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-xl">Aggiungi copia</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                {workTitle
                                    ? `Aggiungi una nuova copia di "${workTitle}".`
                                    : "Aggiungi una nuova copia dell'opera."}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label>ID Copia *</Label>
                                <Input
                                    placeholder="es. 9788845927690-1"
                                    {...register("id")}
                                />
                                <FieldError message={errors.id?.message} />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Posizione</Label>
                                <Controller
                                    name={"locationId"}
                                    control={control}
                                    render={({ field }) => (
                                        <LocationSelect
                                            locations={locations}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        />
                                    )}
                                />
                                <FieldError message={errors.locationId?.message} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Data di acquisizione</Label>
                                    <Controller
                                        name={"acquisitionDate"}
                                        control={control}
                                        render={({ field }) => (
                                            <DateSelector
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                                placeholder={"Seleziona data"}
                                            />
                                        )}
                                    />
                                    <FieldError message={errors.acquisitionDate?.message} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Prezzo</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...register("price")}
                                    />
                                    <FieldError message={errors.price?.message} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                                    Annulla
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Aggiunta...
                                        </>
                                    ) : (
                                        "Aggiungi copia"
                                    )}
                                </Button>
                            </DialogFooter>

                        </form>
                    </>
                )}

                {/* Conferma con riepilogo dati nuova copia */}
                {phase === "confirm" && (
                    <ConfirmDialogContent
                        onClose={() => setPhase("form")}
                        onConfirm={handleConfirm}
                        closeOnConfirm={false}
                        title="Conferma inserimento copia"
                        description={workTitle ? `Controlla i dati per la nuova copia di "${workTitle}":` : "Controlla i dati per la nuova copia:"}
                        confirmLabel="Conferma e aggiungi"
                        cancelLabel="Indietro"
                    >
                        <div className="space-y-3 py-2">
                            <SummaryRow
                                icon={Hash}
                                label={"ID copia"}
                                value={summaryData.id}
                            />
                            <SummaryRow
                                icon={MapPin}
                                label={"Posizione"}
                                value={summaryData.locationLabel || "Non specificata"}
                            />
                            <SummaryRow
                                icon={Calendar}
                                label={"Data di acquisizione"}
                                value={summaryData.acquisitionDate ? format(new Date(summaryData.acquisitionDate), "PPP", { locale: it }) : "Non specificata"}
                            />
                            <SummaryRow
                                icon={Euro}
                                label={"Prezzo"}
                                value={summaryData.price ? `€ ${Number(summaryData.price).toFixed(2)}` : "Non specificato"}
                            />
                        </div>
                    </ConfirmDialogContent>
                )}


                {/* Richiede se si vuole aggiungere un'altra copia dell'opera */}
                {phase === "again" && (
                    <ConfirmDialogContent
                        onClose={handleClose}
                        onConfirm={handleAddAnother}
                        closeOnConfirm={false}
                        title="Copia aggiunta"
                        description="Vuoi aggiungere un'altra copia di questa opera?"
                        confirmLabel="Sì, aggiungi"
                        cancelLabel="Ho finito"
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}