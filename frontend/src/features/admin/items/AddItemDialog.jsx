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

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function AddItemDialog({ open, onClose, onSuccess, workId, workTitle }) {
    const { form, loading, locations, submit } = useAddItem(workId, open);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { register, setValue, watch, formState: { errors } } = form;

    // Valida il form e se ok apre il riepilogo
    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = await form.trigger();
        if (!valid) return;
        setConfirmOpen(true);
    };

    // Chiamato dopo la conferma nel riepilogo
    const handleConfirm = async () => {
        const ok = await submit(onSuccess);
        if (ok) {
            setConfirmOpen(false);
            onClose();
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    // Costruisce i dati di riepilogo da mostrare nel dialog di conferma
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
            <Dialog open={open && !confirmOpen} onOpenChange={handleClose}>
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
                                onValueChange={(val) => setValue("locationId", val)}
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

                        {/* Currency — predisposto, da implementare */}
                        {/*
                        <div className="space-y-1.5">
                            <Label>Valuta</Label>
                            <Select onValueChange={(val) => setValue("currencyCode", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleziona valuta" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map(c => (
                                        <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        */}

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose} disabled={loading}>
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

            <ConfirmAddItemDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                loading={loading}
                data={summaryData}
                workTitle={workTitle}
            />
        </>
    );
}