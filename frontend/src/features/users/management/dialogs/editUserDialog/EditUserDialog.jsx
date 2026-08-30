import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { useEditUser } from "@/features/users/management/dialogs/editUserDialog/useEditUser.js";
import { User, Mail, Phone } from "lucide-react";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";


export default function EditUserDialog({ user, open, onClose, onConfirm }) {
    const {
        form,
        loading,
        setLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        resetAll
    } = useEditUser(user, open);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = form;

    const navigate = useNavigate();
    const onSubmit = handleSubmit(handlePreSubmit);

    const handleConfirmFinal = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await onConfirm(user.id, pendingData);
            resetAll();
            onClose();
        } catch (error) {
            handleApiError(error);
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
            {/* Dialog del form di modifica */}
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Modifica {user?.firstName} {user?.lastName}
                        </DialogTitle>
                        <DialogDescription>
                            Modifica i dati anagrafici dell'utente
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Nome</Label>
                                <Input {...register("firstName")} />
                                {errors.firstName && (
                                    <p className="text-xs text-destructive">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Cognome</Label>
                                <Input {...register("lastName")} />
                                {errors.lastName && (
                                    <p className="text-xs text-destructive">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Telefono</Label>
                            <Input
                                type="tel"
                                placeholder="Opzionale"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleFullClose}
                                disabled={loading}
                            >
                                Annulla
                            </Button>

                            <Button type="submit">
                                Avanti
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog di conferma con riepilogo finale passato come children a ConfirmDialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmFinal}
                title="Conferma modifiche"
                description="Controlla i nuovi dati prima di salvare le modifiche all'utente."
                confirmLabel="Salva modifiche"
                cancelLabel="Indietro"
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={User}
                        label="Nome e Cognome"
                        value={`${pendingData?.firstName || ""} ${pendingData?.lastName || ""}`}
                    />
                    <SummaryRow
                        icon={Mail}
                        label="Email"
                        value={pendingData?.email}
                    />
                    <SummaryRow
                        icon={Phone}
                        label="Telefono"
                        value={pendingData?.phone || "Nessuno"}
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}