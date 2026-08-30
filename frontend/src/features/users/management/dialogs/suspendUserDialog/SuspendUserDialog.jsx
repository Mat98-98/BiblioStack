import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { AlertTriangle, FileText } from "lucide-react";
import { addDays } from "date-fns";
import { useSuspendUser } from "@/features/users/management/dialogs/suspendUserDialog/useSuspendUser.js";
import { useAuth } from "@/context/AuthContext.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import DateSelector from "@/components/common/DateSelector.jsx";
import { Controller } from "react-hook-form";
import { safeFormat } from "@/lib/dateUtils.js";


export default function SuspendUserDialog({ user, open, onClose, onConfirm }) {
    const { user: admin } = useAuth();
    const {
        form,
        loading,
        setLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        resetAll
    } = useSuspendUser();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors }
    } = form;

    const navigate = useNavigate();


    const onSubmit = handleSubmit(handlePreSubmit);

    const handleConfirmFinal = async () => {
        if (!user || !admin) return;

        setLoading(true);
        try {
            await onConfirm({
                userId: user.id,
                handledBy: admin.id,
                ...(pendingData.reason ? { reason: pendingData.reason } : {}),
                ...(pendingData.endDate ? { endDate: pendingData.endDate } : {}),
            });

            resetAll();
            onClose();
        } catch (error) {
            handleApiError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

    const handleFullClose = () => {
        if (loading) return;
        resetAll();
        onClose();
    };

    return (
        <>
            {/* Dialog del Form Sospensione */}
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Sospendi {user?.firstName} {user?.lastName}
                        </DialogTitle>
                        <DialogDescription>
                            L'utente non potrà accedere fino alla riattivazione
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Motivo</Label>
                            <Textarea
                                placeholder="Motivo della sospensione (opzionale)"
                                rows={3}
                                className="resize-none break-all"
                                {...register("reason")}
                            />
                            {errors.reason && (
                                <p className="text-xs text-destructive">
                                    {errors.reason.message}
                                </p>
                            )}
                        </div>

                        {/* Sezione data */}
                        <div className="space-y-1.5 flex flex-col">
                            <Label>Data fine sospensione</Label>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <DateSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder={"Seleziona data (opzionale)"}
                                        minDate={addDays(new Date(), 1)}
                                        captionLayout={"dropdown"}
                                        startYear={new Date().getFullYear()}
                                        endYear={new Date().getFullYear() + 3}
                                    />
                                )}
                            />

                            <p className="text-xs text-muted-foreground mt-1">
                                Lascia vuoto per sospensione a tempo indeterminato
                            </p>

                            {errors.endDate && (
                                <p className="text-xs text-destructive">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleFullClose}
                            >
                                Annulla
                            </Button>

                            <Button type="submit" variant="destructive">
                                Avanti
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog di Conferma Sospensione */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmFinal}
                title="Conferma sospensione"
                description={`Sei sicuro di voler sospendere ${user?.firstName} ${user?.lastName}?`}
                confirmLabel="Sospendi utente"
                cancelLabel="Indietro"
                variant="destructive"
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={AlertTriangle}
                        label="Tipo Sospensione"
                        value={safeFormat(pendingData?.endDate) || "Permanente (tempo indeterminato)"}
                    />
                    <SummaryRow
                        icon={FileText}
                        label="Motivo"
                        value={pendingData?.reason || "Nessun motivo specificato"}
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}