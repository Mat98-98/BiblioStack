import { Loader2, User, BookOpen, Calendar, Tag } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

function SummaryRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground"/>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                {typeof value === "string" ? (
                    <span className="text-sm font-medium">{value}</span>
                ) : (
                    value
                )}
            </div>
        </div>
    );
}

export default function ConfirmAddLoanDialog ({ open, onClose, onBack, onConfirm, loading, patron, item, dueDate }) {
    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Conferma prestito</DialogTitle>
                    <DialogDescription> Controlla i dati del prestito prima di registrarlo nel sistema.</DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={User}
                        label="Utente"
                        value=  {patron ? (
                                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                                        <span className="text-sm font-medium truncate">
                                            {patron.firstName} {patron.lastName}
                                        </span>
                                        <span className="text-xs text-muted-foreground text-right">
                                            {patron.email}
                                        </span>
                                    </div>
                                ) : "-"
                        }
                    />

                    <SummaryRow
                        icon={BookOpen}
                        label="Libro"
                        value={item ? (
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                                <span className="text-sm font-medium truncate">
                                    {item.work.title}
                                </span>
                                <span className="text-xs text-muted-foreground text-right">
                                    [Cod: {item.id}]
                                </span>
                            </div>
                            ) : "-"}
                    />

                    <SummaryRow
                        icon={Calendar}
                        label="Data di scadenza"
                        value={dueDate}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onBack} disabled={loading}>Indietro</Button>
                    <Button onClick={onConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Registrazione...
                            </>
                        ) : (
                            "Conferma prestito"
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}