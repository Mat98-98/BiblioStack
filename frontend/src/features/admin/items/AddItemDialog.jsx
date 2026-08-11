import { useState } from 'react';
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";

import { useAddItem } from "@/features/admin/items/useAddItem.js";
import LocationSelect from "@/features/admin/items/components/LocationSelect.jsx";
import ConfirmAddItemDialog from "@/features/admin/items/components/ConfirmAddItemDialog.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function AddItemDialog({ open, onClose, onSuccess, workId, workTitle }) {
    const { form, loading, locations, submit } = useAddItem(workId, open);

    // Stati per gestire i passaggi dei dialog
    const [confirmOpen, setConfirmOpen] = useState(false); // Dialog riepilogo dati
    const [addAnotherOpen, setAddAnotherOpen] = useState(false); // Dialog che chiede se si vogliono aggiungere altre copie dell'opera

    const { register, setValue, watch, formState: { errors } } = form;

    // Valida il form e se ok apre il riepilogo
    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = await form.trigger();
        if (!valid) return;
        setConfirmOpen(true);
    };

    // Esegue il salvataggio dopo la conferma del riepilogo
    const handleConfirm = async () => {
        const ok = await submit(onSuccess);
        if (ok) {
            setConfirmOpen(false);
            setAddAnotherOpen(true);
        }
    };

    // Reset completo dello stato e chiusura totale
    const handleClose = () => {
        form.reset();
        setConfirmOpen(false);
        setAddAnotherOpen(false);
        onClose();
    };

    // Aggiunta di altre copie
    const handleAddAnother = () => {
        setAddAnotherOpen(false);
    };

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
        <>
            <Dialog open={open && !confirmOpen && !addAnotherOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-md">

                    <DialogHeader>
                        <DialogTitle>Aggiungi copia</DialogTitle>
                        <DialogDescription>
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
                            <LocationSelect
                                locations={locations}
                                value={watch("locationId")}
                                onValueChange={(val) => setValue("locationId", val, { shouldValidate: true })}
                            />
                            <FieldError message={errors.locationId?.message} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Data acquisizione</Label>
                                <Input type="date" {...register("acquisitionDate")} />
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
                </DialogContent>
            </Dialog>

            {/* Conferma con riepilogo dati nuova copia */}
            <ConfirmAddItemDialog
                open={confirmOpen}
                onClose={handleClose}
                onBack={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                loading={loading}
                data={summaryData}
                workTitle={workTitle}
            />

            {/* Richiede se si vuole aggiungere un'altra copia dell'opera */}
            <ConfirmDialog
                open={addAnotherOpen}
                onClose={handleClose}
                onConfirm={handleAddAnother}
                closeOnConfirm={false}
                title="Copia aggiunta"
                description="Vuoi aggiungere un'altra copia di questa opera?"
                confirmLabel="Sì, aggiungi"
                cancelLabel="Ho finito"
            />
        </>
    );
}