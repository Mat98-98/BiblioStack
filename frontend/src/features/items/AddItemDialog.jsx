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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

import { useAddItem } from "./useAddItem.js";

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-xs text-destructive mt-1">{message}</p>;
}

/**
 * Dialog per aggiungere una copia (item) a un'opera.
 *
 * Props:
 * - open      → booleano che controlla la visibilità
 * - onClose   → callback per chiudere il dialog
 * - onSuccess → callback chiamata dopo aggiunta con successo (es. refresh lista)
 * - workId    → id dell'opera a cui aggiungere la copia
 * - workTitle → titolo dell'opera (mostrato nella description)
 */
export default function AddItemDialog({ open, onClose, onSuccess, workId, workTitle }) {
    const { form, loading, locations, submit } = useAddItem(workId);

    const {
        register,
        setValue,
        formState: { errors }
    } = form;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submit(onSuccess);
        onClose();
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    // Raggruppa le location per scuola per il combobox
    const groupedLocations = locations.reduce((acc, loc) => {
        const schoolName = loc.school?.name ?? "Senza scuola";
        if (!acc[schoolName]) acc[schoolName] = [];
        acc[schoolName].push(loc);
        return acc;
    }, {});

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden">

                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl">Aggiungi copia</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {workTitle
                            ? `Aggiungi una nuova copia di "${workTitle}".`
                            : "Aggiungi una nuova copia."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">

                    {/* ID COPIA */}
                    <div className="space-y-2">
                        <Label>ID Copia *</Label>
                        <Input
                            placeholder="es. 9788845927690-1"
                            {...register("id")}
                        />
                        <FieldError message={errors.id?.message} />
                    </div>

                    {/* LOCATION */}
                    <div className="space-y-2">
                        <Label>Posizione</Label>
                        <Select
                            onValueChange={(val) =>
                                setValue("locationId", val ? Number(val) : null)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona una posizione" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(groupedLocations).map(([school, locs]) => (
                                    <div key={school}>
                                        {/* Header gruppo scuola */}
                                        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                            {school}
                                        </p>
                                        {locs.map((loc) => (
                                            <SelectItem
                                                key={loc.id}
                                                value={String(loc.id)}
                                            >
                                                {loc.shelfCode ?? `Scaffale ${loc.id}`}
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError message={errors.locationId?.message} />
                    </div>

                    {/* DATA ACQUISIZIONE + PREZZO affiancati */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data acquisizione</Label>
                            <Input
                                type="date"
                                {...register("acquisitionDate")}
                            />
                            <FieldError message={errors.acquisitionDate?.message} />
                        </div>

                        <div className="space-y-2">
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

                    {/* CURRENCY — predisposto, da implementare */}
                    {/*
                    <div className="space-y-2">
                        <Label>Valuta</Label>
                        <Select onValueChange={(val) => setValue("currencyCode", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona valuta" />
                            </SelectTrigger>
                            <SelectContent>
                                currencies.map(c => (
                                    <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                                ))
                            </SelectContent>
                        </Select>
                    </div>
                    */}

                    <DialogFooter className="pt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
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
    );
}