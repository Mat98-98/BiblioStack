import { useState } from "react";
import { BookMarked } from "lucide-react";
import { useReservation } from "../hooks/useReservations.js";
import { Button } from "@/components/ui/button.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";


export default function WorkReservationButton({ work }) {
    const { reserve } = useReservation();
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <Button size="sm" onClick={() => setConfirmOpen(true)}>
                <BookMarked className="h-4 w-4" />
                Prenota
            </Button>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => reserve(work.id)}
                title="Conferma prenotazione"
                description={`Vuoi prenotare "${work.title}"? Riceverai una notifica quando la copia sarà pronta al ritiro.`}
                confirmLabel="Prenota"
            />
        </>
    );
}