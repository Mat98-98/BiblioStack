import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { AlertTriangle, FileText } from "lucide-react";
import { Controller } from "react-hook-form";
import { useNoticeTypes } from "@/features/notices/hooks/useNoticeTypes.js";
import { useCreateNotice } from "@/features/notices/hooks/useCreateNotice.js";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import AppCombobox from "@/components/common/AppCombobox.jsx";

export default function NoticeDialog({ loan, open, onClose, onConfirm }) {
    // Fetch pigra: parte solo quando il dialog è aperto, non al mount
    const { noticeTypes, loading: typesLoading } = useNoticeTypes(open);
    const {
        form, loading, setLoading,
        confirmDialogOpen, setConfirmDialogOpen,
        pendingData, handlePreSubmit, resetAll
    } = useCreateNotice();

    const { register, handleSubmit, control, formState: { errors } } = form;
    const navigate = useNavigate();

    const onSubmit = handleSubmit(handlePreSubmit);

    const handleConfirmFinal = async () => {
        if (!loan) return;

        console.log("[NoticeDialog] invio segnalazione", {
            loanId: loan.id,
            noticeTypeId: pendingData.noticeTypeId,
            description: pendingData.description
        });

        setLoading(true);
        try {
            await onConfirm({
                loanId: loan.id,
                noticeTypeId: pendingData.noticeTypeId,
                description: pendingData.description
            });
            console.log("[NoticeDialog] segnalazione inviata con successo");

            resetAll();
            onClose();
        } catch (error) {
            console.error("[NoticeDialog] errore invio segnalazione", error);
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

    const selectedType = noticeTypes.find(t => t.id === pendingData?.noticeTypeId);

    return (
        <>
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Nuova segnalazione</DialogTitle>
                        <DialogDescription>
                            {loan?.item?.id
                                ? `Segnalazione relativa alla copia ${loan.item.id}`
                                : "Segnala un problema relativo a questo prestito"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Tipo di segnalazione</Label>
                            <Controller
                                name="noticeTypeId"
                                control={control}
                                render={({ field }) => (
                                    <AppCombobox
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={noticeTypes}
                                        loading={typesLoading}
                                        placeholder="Seleziona tipo..."
                                        searchPlaceholder="Cerca tipo..."
                                        getOptionValue={(t) => t.id}
                                        renderLabel={(t) => t.name}
                                    />
                                )}
                            />
                            {errors.noticeTypeId && (
                                <p className="text-xs text-destructive">{errors.noticeTypeId.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Descrizione</Label>
                            <Textarea
                                placeholder="Descrivi il problema riscontrato"
                                rows={4}
                                className="resize-none break-all"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleFullClose}>
                                Annulla
                            </Button>
                            <Button type="submit" variant="default">
                                Avanti
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmFinal}
                title="Conferma segnalazione"
                description="Vuoi registrare questa segnalazione?"
                confirmLabel="Registra segnalazione"
                cancelLabel="Indietro"
                variant="destructive"
            >
                <div className="space-y-3 py-2">
                    <SummaryRow icon={AlertTriangle} label="Tipo" value={selectedType?.name ?? "—"} />
                    <SummaryRow icon={FileText} label="Descrizione" value={pendingData?.description || "—"} />
                </div>
            </ConfirmDialog>
        </>
    );
}