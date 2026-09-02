import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { SummaryRow } from "@/components/common/SummaryRow.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.jsx";
import { useChangeRole } from "@/features/users/management/dialogs/changeRoleDialog/useChangeRole.js";
import { ShieldAlert, UserCog } from "lucide-react";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";



const roleLabels = {
    student: "Studente",
    librarian: "Bibliotecario",
    admin: "Admin"
};

const roles = ["student", "librarian", "admin"];


export default function ChangeRoleDialog({ user, open, onClose, onUpdated }) {
    const {
        role,
        setValue,
        handleSubmit,
        handlePreSubmit,
        confirmDialogOpen,
        setConfirmDialogOpen,
        pendingData,
        resetAll
    } = useChangeRole(user);

    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    if (!user) return null;

    const currentRole = user.role?.name;

    const onSubmit = handleSubmit(handlePreSubmit);

    const handleConfirmFinal = async () => {
        if (!user.id || !pendingData?.role) return;

        setSubmitting(true);
        try {
            // Passa id e nuovo ruolo alla funzione genitore
            await onUpdated(user.id, pendingData.role);
            resetAll();
            onClose();
        } catch (error) {
            handleApiError(error, navigate);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFullClose = () => {
        if (submitting) return;
        resetAll();
        onClose();
    };

    return (
        <>
            {/* Dialog del Form */}
            <Dialog open={open && !confirmDialogOpen} onOpenChange={(v) => { if (!v) handleFullClose(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Cambia ruolo</DialogTitle>
                        <DialogDescription>
                            Modifica i privilegi di accesso nel sistema per questo utente.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4 py-2">
                        <div className="text-sm text-muted-foreground">
                            Utente:{" "}
                            <span className="font-medium text-foreground">
                                {user.firstName} {user.lastName}
                            </span>
                        </div>

                        <RadioGroup
                            value={role}
                            onValueChange={(v) => setValue("role", v, { shouldValidate: true })}
                        >
                            {roles.map(r => (
                                <div key={r} className="flex items-center space-x-2">
                                    <RadioGroupItem value={r} id={`role-${r}`} />
                                    <Label htmlFor={`role-${r}`} className={r === currentRole ? "opacity-50" : "cursor-pointer"}>
                                        {roleLabels[r]}
                                        {r === currentRole && " (attuale)"}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={handleFullClose}>
                                Annulla
                            </Button>

                            <Button
                                type="submit"
                                disabled={role === currentRole}
                            >
                                Avanti
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog di Conferma Finale */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmFinal}
                title="Conferma cambio ruolo"
                description={`Sei sicuro di voler cambiare il ruolo di ${user.firstName} ${user.lastName}?`}
                confirmLabel="Aggiorna ruolo"
                cancelLabel="Indietro"
                variant={pendingData?.role === 'admin' ? "destructive" : "default"} // Rosso se promuove ad admin
            >
                <div className="space-y-3 py-2">
                    <SummaryRow
                        icon={UserCog}
                        label="Ruolo attuale"
                        value={roleLabels[currentRole] || currentRole}
                    />
                    <SummaryRow
                        icon={ShieldAlert}
                        label="Nuovo ruolo"
                        value={roleLabels[pendingData?.role]}
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}