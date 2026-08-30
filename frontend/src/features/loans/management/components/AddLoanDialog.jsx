import { useState } from "react";
import { useCardVerification } from "@/features/qrCode/hooks/useCardVerification.js";
import { useAddLoan } from "@/features/loans/management/hooks/useAddLoan.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Controller } from "react-hook-form";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { Loader2, QrCode, Barcode, User, BookOpen, XCircle, BookPlus, Calendar } from "lucide-react";
import { notify } from "@/lib/notify.js";
import { safeFormat } from "@/lib/dateUtils.js";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.jsx";
import CodeScannerDialog from "@/features/qrCode/CodeScannerDialog.jsx";
import DateSelector from "@/components/common/DateSelector.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";



export default function AddLoanDialog({ open, onClose }) {
    const {
        form,
        loading,
        patronInfo,
        patronLoading,
        itemInfo,
        itemLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        confirmAndSubmit,
        resetAll
    } = useAddLoan(onClose);

    const { register, handleSubmit, setValue, control, formState: { errors } } = form;

    const [scannerOpen, setScannerOpen] = useState(false);
    const { verify, reset: resetVerification } = useCardVerification();

    const handleUserScan = async (rawToken) => {
        const result = await verify(rawToken);
        if (result?.valid && result?.userId) {
            setValue("userId", result.userId, { shouldValidate: true });
        }
    };

    const handleFullClose = () => {
        resetVerification();
        resetAll();
        onClose();
    };

    return (
        <>
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Presta libro</DialogTitle>
                        <DialogDescription>
                            Registra un nuovo prestito assegnando una copia disponibile a un utente.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(handlePreSubmit)} className="flex flex-col gap-4">
                        <FieldGroup>
                            {/* Sezione Utente */}
                            <Field data-invalid={!!errors.userId}>
                                <FieldLabel htmlFor="userId">
                                    Utente (ID tessera) <span className="text-primary">*</span>
                                </FieldLabel>
                                <div className="flex gap-2">
                                    <Input
                                        id="userId"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="flex-1"
                                        {...register("userId")}
                                        placeholder="Es. 42"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-primary/50"
                                        onClick={() => setScannerOpen(true)}
                                    >
                                        <QrCode className="h-4 w-4" />
                                    </Button>
                                </div>
                                <FieldError errors={errors.userId ? [errors.userId] : undefined} />

                                {patronLoading && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Verificando utente...
                                    </div>
                                )}

                                {!patronLoading && patronInfo?.valid && patronInfo.user && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 text-xs mt-1">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                                            <User className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-medium text-foreground">
                                            {patronInfo.user.firstName} {patronInfo.user.lastName}
                                        </span>
                                        <span className="text-muted-foreground ml-auto">
                                            ({patronInfo.user.email})
                                        </span>
                                    </div>
                                )}

                                {!patronLoading && patronInfo?.valid === false && (
                                    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                                        <XCircle className="h-3.5 w-3.5" /> Tessera / Utente non trovato
                                    </div>
                                )}
                            </Field>

                            {/* Sezione Copia */}
                            <Field data-invalid={!!errors.itemId}>
                                <FieldLabel htmlFor="itemId">
                                    Codice inventario copia <span className="text-primary">*</span>
                                </FieldLabel>
                                <div className="flex gap-2">
                                    <Input
                                        id="itemId"
                                        className="flex-1"
                                        {...register("itemId")}
                                        placeholder="Es. INV-1001"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-primary/50"
                                        onClick={() => notify.info("Funzionalità non ancora implementata")}
                                    >
                                        <Barcode className="h-4 w-4" />
                                    </Button>
                                </div>
                                <FieldError errors={errors.itemId ? [errors.itemId] : undefined} />

                                {itemLoading && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Verificando copia...
                                    </div>
                                )}

                                {!itemLoading && itemInfo?.valid && itemInfo.item && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 text-xs mt-1">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                                            <BookOpen className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-medium text-foreground truncate">
                                            {itemInfo.item.work?.title || "Copia valida"}
                                        </span>
                                    </div>
                                )}

                                {!itemLoading && itemInfo?.valid === false && (
                                    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                                        <XCircle className="h-3.5 w-3.5" /> Copia non trovata o non disponibile
                                    </div>
                                )}
                            </Field>

                            {/* Sezione Scadenza */}
                            <Field data-invalid={!!errors.dueDate}>
                                <FieldLabel htmlFor="dueDate">
                                    Data di scadenza <span className="text-primary">*</span>
                                </FieldLabel>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DateSelector
                                            id="dueDate"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            placeholder={"Seleziona la data di scadenza"}
                                            minDate={new Date()}
                                            excludeWeekends={true}
                                        />
                                    )}
                                />
                                <FieldError errors={errors.dueDate ? [errors.dueDate] : undefined} />
                            </Field>
                        </FieldGroup>

                        <DialogFooter className="mt-2">
                            <Button type="button" variant="outline" onClick={handleFullClose}>Annulla</Button>
                            <Button type="submit">
                                Avanti
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>

                <CodeScannerDialog
                    open={scannerOpen}
                    onClose={() => setScannerOpen(false)}
                    onScan={handleUserScan}
                    type="qr"
                />
            </Dialog>

            {/* Dialog di Riepilogo Finale */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onBack={() => setConfirmDialogOpen(false)}
                onConfirm={confirmAndSubmit}
                loading={loading}
                title={"Conferma prestito"}
                description={"Controlla i dati prima di registrare il prestito"}
                confirmLabel={"Conferma e registra"}
                cancelLabel={"Indietro"}
                onCancel={() => setConfirmDialogOpen(false)}
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={User}
                        label={"Utente"}
                        value={patronInfo?.user ? `${patronInfo.user.firstName} ${patronInfo.user.lastName}` : pendingData?.userId}
                    />
                    <SummaryRow
                        icon={BookPlus}
                        label={"Opera / Copia"}
                        value={itemInfo?.item?.work?.title ? `${itemInfo.item.work.title} (${pendingData?.itemId})` : pendingData?.itemId}
                    />
                    <SummaryRow
                        icon={Calendar}
                        label={"Data di scadenza"}
                        value={safeFormat(pendingData?.dueDate) || "Non definita"}
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}