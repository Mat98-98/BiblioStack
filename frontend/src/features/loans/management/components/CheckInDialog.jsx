import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { notify } from "@/lib/notify.js";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import api from "@/api/axios.js";
import {quickCheckInSchema} from "@/features/loans/management/schemas/loan.schema.js";


export default function CheckInDialog({ open, onClose, loan = null, onSuccess }) {
    const [itemId, setItemId] = useState("");
    const isQuickMode = !loan;

    // Pulisce lo stato quando si chiude il dialog
    useEffect(() => {
        if (!open) {
            setItemId("");
        }
    }, [open]);

    const handleCheckInConfirm = async () => {
        if (!isQuickMode) {
            // Modalità da azioni tabella
            await api.patch(`/loans/${loan.id}/checkIn`);
            notify.success(`Copia ${loan.item?.id} riconsegnata con successo!`);
            onSuccess?.();
        } else {
            // Modalità tramite button nell'header
            const result = quickCheckInSchema.safeParse({ itemId: itemId.trim() });
            if (!result.success) {
                notify.error(result.error.issues[0].message);
                throw new Error("Validazione fallita");
            }
            const trimmedId = result.data.itemId;

            const { data: itemData } = await api.get(`/items/${trimmedId}`);

            if (!itemData) {
                notify.error("La copia specificata non esiste nel sistema.");
                throw new Error("Copia non trovata");
            }

            const activeLoan = itemData?.loans?.find((l) => l.returnDate === null);

            if (!activeLoan) {
                notify.error(`La copia "${trimmedId}" non risulta attualmente in prestito.`);
                throw new Error("Prestito non trovato");
            }

            await api.patch(`/loans/${activeLoan.id}/checkIn`);
            notify.success(`Copia ${trimmedId} riconsegnata con successo!`);
            setItemId("");
            onSuccess?.();
        }
    };

    // Testi dinamici in base al contesto
    const title = isQuickMode ? "Riconsegna rapida copia" : "Conferma riconsegna";
    const description = isQuickMode
        ? "Inserisci il codice inventario della copia da rientrare."
        : `Vuoi registrare la riconsegna per la copia ${loan?.item?.id}?`;

    return (
        <ConfirmDialog
            open={open}
            onClose={onClose}
            onConfirm={handleCheckInConfirm}
            title={title}
            description={description}
            confirmLabel={isQuickMode ? "Conferma Riconsegna" : "Riconsegna"}
        >
            {/* Mostra il form solo se richiamata dal button nell'header */}
            {isQuickMode && (
                <div className="flex flex-col gap-2 py-2">
                    <Label htmlFor="checkInItemId">Codice inventario copia</Label>
                    <Input
                        id="checkInItemId"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        placeholder="Es. INV-1001"
                        autoFocus
                    />
                </div>
            )}
        </ConfirmDialog>
    );
}