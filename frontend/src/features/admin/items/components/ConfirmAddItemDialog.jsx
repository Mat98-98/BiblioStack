import { Loader2, BookOpen, MapPin, Calendar, Tag } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

// Componente di presentazione per le righe di riepilogo
function SummaryRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
            </div>
        </div>
    );
}

export default function ConfirmAddItemDialog({ open, onClose, onBack, onConfirm, loading, data, workTitle }) {
    if (!data) return null;

    return (
        // onOpenChange gestisce sia il click sulla crocetta di chiusura che la pressione del tasto ESC
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle>Conferma aggiunta</DialogTitle>
                    <DialogDescription>
                        Controlla i dati prima di aggiungere la copia.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={BookOpen}
                        label="Opera"
                        value={workTitle}
                    />
                    <SummaryRow
                        icon={Tag}
                        label="ID Copia"
                        value={data.id}
                    />
                    <SummaryRow
                        icon={MapPin}
                        label="Posizione"
                        value={data.locationLabel ?? "Non specificata"}
                    />
                    <SummaryRow
                        icon={Calendar}
                        label="Data acquisizione"
                        value={data.acquisitionDate ?? "Non specificata"}
                    />
                    <SummaryRow
                        icon={Tag}
                        label="Prezzo"
                        value={data.price ? `€ ${Number(data.price).toFixed(2)}` : "Non specificato"}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onBack} disabled={loading}>
                        Indietro
                    </Button>
                    <Button onClick={onConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Aggiunta...
                            </>
                        ) : (
                            "Conferma"
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}