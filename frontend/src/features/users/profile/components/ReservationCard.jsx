import { BookMarked, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { formatAuthors } from "@/lib/authorUtils.js";
import { safeFormat } from "@/lib/dateUtils.js";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item.jsx";
import { useState } from "react";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import ReservationStatusBadge from "@/features/reservations/components/ReservationStatusBadge.jsx";


export default function ReservationCard({
                                            reservation,
                                            onCancel,
                                            loading,
                                        }) {
    const [cancelOpen, setCancelOpen] = useState(false);

    const authors = formatAuthors(reservation.work?.authors);
    const reservationDate = safeFormat(reservation.reservationDate);

    const handleConfirmCancel = async () => {
        const success = await onCancel(reservation.id);

        if (success) {
            setCancelOpen(false);
        }
    };

    return (
        <>
            <Item
                variant="outline"
                className="grid grid-cols-[auto_minmax(0,1fr)_max-content] items-center gap-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
                <ItemMedia
                    variant="icon"
                    className="h-10 w-10 shrink-0 rounded-xl bg-primary/10"
                >
                    <BookMarked className="h-5 w-5 text-primary" />
                </ItemMedia>

                <ItemContent className="min-w-0 gap-1">
                    <ItemTitle className="w-full min-w-0 truncate">
                        {reservation.work?.title ?? "Titolo non disponibile"}
                        {authors && ` - ${authors}`}
                    </ItemTitle>

                    <ItemDescription>
                        Prenotato il {reservationDate}
                    </ItemDescription>
                </ItemContent>

                <div className="flex shrink-0 items-center gap-2">
                    <ReservationStatusBadge
                        status={reservation.status}
                        expiresAt={reservation.expiresAt}
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setCancelOpen(true)}
                        disabled={loading}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </Item>

            <ConfirmDialog
                open={cancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                closeOnConfirm={false}
                title="Annulla prenotazione"
                description={`Sei sicuro di voler annullare la prenotazione per "${reservation.work?.title ?? "questa opera"}"?`}
                confirmLabel="Annulla prenotazione"
                cancelLabel="Chiudi"
                variant="destructive"
            />
        </>
    );
}