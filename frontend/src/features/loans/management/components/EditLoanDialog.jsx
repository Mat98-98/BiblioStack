import { useEditLoan } from "@/features/loans/management/hooks/useEditLoan.js";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { Controller } from "react-hook-form";
import { safeFormat } from "@/lib/dateUtils.js";
import { QrCode, BookOpen, User, Calendar } from "lucide-react";
import DateSelector from "@/components/common/DateSelector.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";


export default function EditLoanDialog({ loan, open, onClose, onConfirm }) {
    const {
        form,
        loading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        handleConfirmFinal,
        resetAll
    } = useEditLoan(loan, open, () => {
        onConfirm?.();
        onClose();
    });
    const { register, handleSubmit, control, formState: { errors } } = form;

    if (!loan) return null;

    // Condizione booleana per determinare se un prestito è già stato restituito
    const isAlreadyReturned = Boolean(loan.returnDate);

    const handleFullClose = () => {
        if (loading) return;
        resetAll();
        onClose();
    };

    return (
        <>
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Modifica prestito</DialogTitle>
                        <DialogDescription>
                            Copia <span className="font-mono">{loan.item.id}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(handlePreSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="dueDate">Data di scadenza</Label>
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <DateSelector
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        placeholder={"Seleziona la data di scadenza"}
                                        minDate={loan.loanDate}
                                        excludeWeekends={true}
                                    />
                                )}
                            />
                            {errors.dueDate && <span className="text-xs text-destructive">{errors.dueDate.message}</span>}
                        </div>

                        {/* Sezione data di restituzione - Visibile soltanto se il prestito è stato consegnato */}
                        {isAlreadyReturned && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="returnDate">Data di restituzione</Label>
                                <Controller
                                    name="returnDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DateSelector
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            placeholder={"Seleziona la data di restituzione"}
                                            minDate={loan.loanDate}
                                            maxDate={new Date()}
                                            excludeWeekends={true}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvataggio..." : "Salva"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog di conferma con riepilogo */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmFinal}
                loading={loading}
                title={"Conferma modifiche prestito"}
                description={"Verifica i dati inseriti prima di confermare la modifica"}
                confirmLabel={"Salva modifiche"}
                onCancel={() => setConfirmDialogOpen(false)}
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={QrCode}
                        label={"Codice copia"}
                        value={loan.item.id}
                    />
                    <SummaryRow
                        icon={BookOpen}
                        label={"Opera"}
                        value={loan?.item?.work?.title || "Non definita"}
                    />
                    <SummaryRow
                        icon={User}
                        label={"Utente"}
                        value={loan.patron ? `${loan.patron.firstName} ${loan.patron.lastName}` : "Non definito"}
                    />
                    <SummaryRow
                        icon={Calendar}
                        label={"Scadenza"}
                        value={safeFormat(pendingData?.dueDate) || "Non definita"}
                    />

                    {/* Visibile solo se è stato restituito */}
                    {isAlreadyReturned && (
                        <SummaryRow
                            icon={Calendar}
                            label={"Data di restituzione"}
                            value={safeFormat(pendingData?.returnDate) || "Non restituito"}
                        />
                    )}
                </div>
            </ConfirmDialog>
        </>
    );
}