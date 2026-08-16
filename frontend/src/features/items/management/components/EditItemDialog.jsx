import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useEditItem } from "@/features/items/management/hooks/useEditItem.js";
import { useLocations } from "@/features/items/management/hooks/useLocations.js";
import LocationSelect from "@/features/items/management/components/LocationSelect.jsx";

export default function EditItemDialog({ item, open, onClose, onConfirm }) {
    const { locations, loading: locationsLoading } = useLocations(open);
    const { form, loading, submit } = useEditItem(item, open, () => {
        onConfirm?.();
        onClose();
    });

    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifica copia</DialogTitle>
                    <DialogDescription>
                        Codice inventario: <span className="font-mono">{item.id}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
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
                        <Input id="acquisitionDate" type="date" {...register("acquisitionDate")} />
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
    );
}