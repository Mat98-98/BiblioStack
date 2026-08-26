import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import { User, Mail, Phone } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { useCreateUser } from "@/features/users/dialogs/createUserDialog/useCreateUser.js";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";


function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-xs text-destructive mt-1">{message}</p>;
}


export default function CreateUserDialog({ open, onClose, onConfirm }) {
    const {
        form,
        loading,
        setLoading,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        handlePreSubmit,
        resetAll
    } = useCreateUser();

    const { register, handleSubmit, formState: { errors } } = form;
    const navigate = useNavigate();

    const onSubmit = handleSubmit(handlePreSubmit);

    const handleConfirmFinal = async () => {
        setLoading(true);
        try {
            await onConfirm(pendingData);
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
            {/* Dialog form inserimento dati nuovo utente */}
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-xl">
                            Crea nuovo utente
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Inserisci le informazioni del nuovo utente della biblioteca. L'utente riceverà un'email per impostare la propria password.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="px-6 pb-6 pt-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nome */}
                            <div className="space-y-2">
                                <Label>Nome *</Label>
                                <Input {...register("firstName")} />
                                <FieldError message={errors.firstName?.message} />
                            </div>

                            {/* Cognome */}
                            <div className="space-y-2">
                                <Label>Cognome *</Label>
                                <Input {...register("lastName")} />
                                <FieldError message={errors.lastName?.message} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input type="email" {...register("email")} />
                            <FieldError message={errors.email?.message} />
                        </div>

                        {/* Numero di telefono */}
                        <div className="space-y-2">
                            <Label>Telefono</Label>
                            <Input
                                type="tel"
                                {...register("phone")}
                                placeholder="Opzionale"
                            />
                            <FieldError message={errors.phone?.message} />
                        </div>

                        <DialogFooter className="pt-4 gap-2 sm:gap-0">
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

            {/* Dialog di conferma riepilogo finale */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmFinal}
                title="Conferma creazione utente"
                description="Controlla i dati prima di registrare il nuovo utente nel sistema."
                confirmLabel="Crea utente"
                cancelLabel="Indietro"
            >
                {/* Passo il riepilogo come children al componente centrale ConfirmDialog */}
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
                        value={pendingData?.phone || "Non specificato"}
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}