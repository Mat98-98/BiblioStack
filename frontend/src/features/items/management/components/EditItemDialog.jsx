import { useState } from "react";
import { Calendar, Euro, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { useEditItem } from "@/features/items/management/hooks/useEditItem.js";
import { useLocations } from "@/features/items/management/hooks/useLocations.js";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import LocationSelect from "@/features/items/management/components/LocationSelect.jsx";
import DateSelector from "@/components/common/DateSelector.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";

export default function EditItemDialog({ item, open, onClose, onConfirm }) {
    const { locations, loading: locationsLoading } = useLocations(open);
    const { form, loading, submit } = useEditItem(item, open, () => {
        onConfirm?.();
        handleFullClose();
    });

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

    if (!item) return null;

    // Intercetta l'invio dei dati e apre il riepilogo
    const handlePreSubmit = async (e) => {
        e.preventDefault();
        const valid = await form.trigger();
        if (!valid) return;
        setConfirmOpen(true);
    };

    // Chiusura totale con reset degli stati del dialog di conferma
    const handleFullClose = () => {
        setConfirmOpen(false);
        onClose();
    };

    // Build dei dati per il riepilogo
    const locationId = watch("locationId");
    const summaryData = {
        acquisitionDate: watch("acquisitionDate"),
        price: watch("price"),
        locationLabel: locations.find(l => l.id === locationId)?.shelfCode ?? (locationId ? `Scaffale ${locationId}` : null)
    };

    return (
        <>
            <Dialog open={open && !confirmOpen} onOpenChange={(v) => !v && handleFullClose()}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Modifica copia</DialogTitle>
                        <DialogDescription>
                            Codice inventario: <span className="font-mono">{item.id}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handlePreSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="price">Prezzo (€)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                {...register("price")}
                                placeholder="Facoltativo"
                            />
                            {errors.price && (
                                <span className="text-xs text-destructive">{errors.price.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="acquisitionDate">Data acquisto</Label>
                            <DateSelector
                                value={watch("acquisitionDate") ?? ""}
                                onChange={(val) => setValue("acquisitionDate", val, {shouldValidate: true})}
                                placeholder={"Seleziona data"}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Collocazione</Label>
                            {locationsLoading ? (
                                <div className="h-9 rounded-md bg-secondary animate-pulse" />
                            ) : (
                                <LocationSelect
                                    locations={locations}
                                    value={watch("locationId")}
                                    onValueChange={(val) => setValue("locationId", val)}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Annulla
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvataggio..." : "Salva"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                onClose={handleFullClose}
                onConfirm={submit}
                loading={loading}
                title="Conferma modifiche"
                description={`Controlla i dati aggiornati per la copia "${item.id}":`}
                confirmLabel="Salva modifiche"
                cancelLabel="Indietro"
                onCancel={() => setConfirmOpen(false)}
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={MapPin}
                        label="Collocazione"
                        value={summaryData.locationLabel || "Non specificata"}
                    />
                    <SummaryRow
                        icon={Calendar}
                        label="Data di acquisto"
                        value={summaryData.acquisitionDate ? format(new Date(summaryData.acquisitionDate), "PPP", { locale: it }) : "Non specificata"}
                    />
                    <SummaryRow
                        icon={Euro}
                        label="Prezzo"
                        value={summaryData.price ? `€ ${Number(summaryData.price).toFixed(2)}` : "Non specificato"}
                    />
                </div>
            </ConfirmDialog>

        </>
    );
}