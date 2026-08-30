import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Ban, Trash2, Pencil, ShieldCheck, User } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu.jsx";
import { ActionsMenu } from "@/components/common/dialogs/ActionsMenu.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import SuspendUserDialog from "@/features/users/management/dialogs/suspendUserDialog/SuspendUserDialog.jsx";
import EditUserDialog from "@/features/users/management/dialogs/editUserDialog/EditUserDialog.jsx";
import ChangeRoleDialog from "@/features/users/management/dialogs/changeRoleDialog/ChangeRoleDialog.jsx";



export default function UserActions({ user, onUpdateRole, onDelete, onSuspend, onUnsuspend, onEdit }) {
    const [deleteOpen, setDeleteOpen]   = useState(false);
    const [suspendOpen, setSuspendOpen] = useState(false);
    const [unsuspendOpen, setUnsuspendOpen] = useState(false);
    const [editOpen, setEditOpen]       = useState(false);
    const [roleOpen, setRoleOpen]       = useState(false);

    const navigate = useNavigate();
    const isSuspended = !!user.suspension;

    // Gestione della cancellazione
    const handleDelete = async () => {
        await onDelete(user.id);
    };

    // Gestione della rimozione della sospensione
    const handleUnsuspend = async () => {
        await onUnsuspend(user.id);
    }

    return (
        <>
            <ActionsMenu>
                <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                    <User className="mr-2 h-4 w-4"/>
                    Vai al profilo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifica
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setRoleOpen(true)}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Cambia ruolo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isSuspended ? (
                        <DropdownMenuItem
                            onClick={() => setUnsuspendOpen(true)}
                            className="text-success focus:text-success"
                        >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Riabilita
                        </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => setSuspendOpen(true)}
                                className="text-warning focus:text-warning"
                            >
                                <Ban className="mr-2 h-4 w-4" />
                                Sospendi
                            </DropdownMenuItem>
                        )}
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Elimina
                    </DropdownMenuItem>
            </ActionsMenu>

            {/* Dialog di conferma soft delete utente */}
            <ConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Elimina utente"
                description={`Sei sicuro di voler eliminare ${user.firstName} ${user.lastName}? L'operazione è irreversibile.`}
                confirmLabel="Elimina"
                cancelLabel="Annulla"
                variant="destructive"
            />

            {/* Dialog sospensione utente */}
            <SuspendUserDialog
                user={user}
                open={suspendOpen}
                onClose={() => setSuspendOpen(false)}
                onConfirm={onSuspend}
            />

            {/* Dialog modifica utente */}
            <EditUserDialog
                user={user}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onConfirm={onEdit}
            />

            {/* Dialog cambio ruolo utente */}
            <ChangeRoleDialog
                user={user}
                open={roleOpen}
                onClose={() => setRoleOpen(false)}
                onUpdated={async (userId, role) => {
                    await onUpdateRole(userId, role)
                    setRoleOpen(false)
                }}
            />

            {/* Dialog di conferma sospensione e riammissione utente */}
            <ConfirmDialog
                open={unsuspendOpen}
                onClose={() => setUnsuspendOpen(false)}
                onConfirm={handleUnsuspend}
                title="Rimuovi sospensione"
                description={`Vuoi riattivare l'account di ${user.firstName} ${user.lastName}? Potrà tornare a prenotare ed effettuare prestiti.`}
                confirmLabel="Rimuovi sospensione"
                cancelLabel="Annulla"
            />
        </>
    )
}