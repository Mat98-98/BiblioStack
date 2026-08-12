import { useState } from "react";
import { BookMarked, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import StatusBadge from "@/features/profile/components/StatusBadge.jsx";

export default function ReservationCard({ reservation, onCancel, loading }) {
    const [cancelOpen, setCancelOpen] = useState(false);

    const reservationDate = new Date(
        reservation.reservationDate
    ).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handleConfirmCancel = async () => {
        const success = await onCancel(reservation.id);
        if (success) {
            setCancelOpen(false);
        }
    };

    return (
        <>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <BookMarked className="h-5 w-5 text-primary" />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="font-medium truncate">
                        {reservation.work?.title ?? "Titolo non disponibile"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Prenotato il {reservationDate}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge
                        status={reservation.status}
                        expiresAt={reservation.expiresAt}
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setCancelOpen(true)}
                        disabled={loading}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={cancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Annulla prenotazione"
                description={`Sei sicuro di voler annullare la prenotazione per "${reservation.work?.title ?? "questa opera"}"?`}
                confirmLabel="Annulla prenotazione"
                cancelLabel="Chiudi"
                variant="destructive"
            />
        </>
    );
}