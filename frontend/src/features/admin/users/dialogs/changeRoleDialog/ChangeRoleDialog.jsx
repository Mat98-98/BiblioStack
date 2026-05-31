import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useChangeRole } from "@/features/admin/users/dialogs/changeRoleDialog/useChangeRole.js";



const roleLabels = {
    student: "Studente",
    librarian: "Bibliotecario",
    admin: "Admin"
}

const roles = ["student", "librarian", "admin"]

export default function ChangeRoleDialog({ user, open, onClose, onUpdated }) {
    const { role, setValue, submit } = useChangeRole(user, onUpdated)

    if (!user) return null

    const currentRole = user.role?.name

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Cambia ruolo</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="text-sm text-muted-foreground">
                        Utente:{" "}
                        <span className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                        </span>
                    </div>

                    <RadioGroup
                        value={role}
                        onValueChange={(v) => setValue("role", v)}
                    >
                        {roles.map(r => (
                            <div key={r} className="flex items-center space-x-2">
                                <RadioGroupItem value={r} />
                                <Label className={r === currentRole ? "opacity-50" : ""}>
                                    {roleLabels[r]}
                                    {r === currentRole && " (attuale)"}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annulla
                    </Button>

                    <Button
                        onClick={submit}
                        disabled={role === currentRole}
                    >
                        Salva
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}