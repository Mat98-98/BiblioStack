import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input.jsx";
import { notify } from "@/lib/notify.js";
import { quickCheckInSchema } from "@/features/loans/management/schemas/loan.schema.js";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import api from "@/api/axios.js";
import NoticeDialog from "@/features/notices/dialogs/NoticeDialog.jsx";
import { Field , FieldGroup, FieldLabel } from "@/components/ui/field.jsx";
import { Button } from "@/components/ui/button.jsx"
import {Barcode} from "lucide-react";


export default function CheckInDialog({ open, onClose, loan = null, onSuccess, onNotify }) {
    const [itemId, setItemId] = useState("");
    const [checkedInLoan, setCheckedInLoan] = useState(null);
    const [askNoticeOpen, setAskNoticeOpen] = useState(false);
    const [noticeOpen, setNoticeOpen] = useState(false);

    const isQuickMode = !loan;

    // Pulisce lo stato quando si chiude il dialog
    useEffect(() => {
        if (!open) {
            setItemId("");
        }
    }, [open]);

    const finishWithoutNotice = () => {
        setAskNoticeOpen(false);
        setCheckedInLoan(null);
        onClose();
    }

    const handleCheckInConfirm = async () => {
        if (!isQuickMode) {
            // Modalità da azioni tabella
            await api.patch(`/loans/${loan.id}/checkIn`);
            notify.success(`Copia ${loan.item?.id} riconsegnata con successo!`);
            onSuccess?.();
            setCheckedInLoan(loan);
            setAskNoticeOpen(true);
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
            setCheckedInLoan({ ...activeLoan, item: { id: trimmedId } });
            setAskNoticeOpen(true);
        }
    };

    // Testi dinamici in base al contesto
    const title = isQuickMode ? "Riconsegna rapida copia" : "Conferma riconsegna";
    const description = isQuickMode
        ? "Inserisci il codice inventario della copia da rientrare."
        : `Vuoi registrare la riconsegna per la copia ${loan?.item?.id}?`;

    return (
        <>
            <ConfirmDialog
                open={open && !askNoticeOpen && !noticeOpen}
                onClose={onClose}
                onConfirm={handleCheckInConfirm}
                title={title}
                description={description}
                confirmLabel={isQuickMode ? "Conferma Riconsegna" : "Riconsegna"}
            >
                {/* Mostra il form solo se richiamata dal button nell'header */}
                {isQuickMode && (
                    <FieldGroup className="py-2">
                        <Field>
                            <FieldLabel htmlFor="checkInItemId">
                                Codice inventario copia <span className="text-primary">*</span>
                            </FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    id="checkInItemId"
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                    placeholder="Es. INV-1001"
                                    autoFocus
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-primary/50"
                                    onClick={() => notify.info("Funzionalità non ancora implementata")}
                                >
                                    <Barcode className="h-4 w-4"/>
                                </Button>
                            </div>
                        </Field>
                    </FieldGroup>
                )}
            </ConfirmDialog>

            <ConfirmDialog
                open={askNoticeOpen}
                onClose={finishWithoutNotice}
                onConfirm={() => {
                    setAskNoticeOpen(false);
                    setNoticeOpen(true);
                }}
                closeOnConfirm={false}
                title="Segnalare un problema?"
                description={`Vuoi registrare una segnalazione relativa alla copia ${checkedInLoan?.item?.id}?`}
                confirmLabel="Sì, segnala"
                cancelLabel="No, ho finito"
            />

            <NoticeDialog
                loan={checkedInLoan}
                open={noticeOpen}
                onClose={() => {
                    setNoticeOpen(false);
                    setCheckedInLoan(null);
                    onClose();
                }}
                onConfirm={onNotify}
            />
        </>
    );
}