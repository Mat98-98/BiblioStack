import { useState } from "react";
import { MoreHorizontal, Shield, Ban, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import SuspendUserDialog from "@/features/admin/users/dialogs/suspendUserDialog/SuspendUserDialog.jsx";
import EditUserDialog from "@/features/admin/users/dialogs/editUserDialog/EditUserDialog.jsx";
import ChangeRoleDialog from "@/features/admin/users/dialogs/changeRoleDialog/ChangeRoleDialog.jsx";

export default function UserActions({ user, onUpdateRole, onDelete, onSuspend, onEdit }) {
    const [deleteOpen, setDeleteOpen]   = useState(false);
    const [suspendOpen, setSuspendOpen] = useState(false);
    const [editOpen, setEditOpen]       = useState(false);
    const [roleOpen, setRoleOpen]       = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifica
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setRoleOpen(true)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Cambia ruolo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setSuspendOpen(true)}
                        className="text-orange-600 focus:text-orange-600"
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        Sospendi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Elimina
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Elimina utente</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sei sicuro di voler eliminare {user.firstName} {user.lastName}? L'operazione è irreversibile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(user.id)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Elimina
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <SuspendUserDialog
                user={user}
                open={suspendOpen}
                onClose={() => setSuspendOpen(false)}
                onConfirm={onSuspend}
            />

            <EditUserDialog
                user={user}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onConfirm={onEdit}
            />

            <ChangeRoleDialog
                user={user}
                open={roleOpen}
                onClose={() => setRoleOpen(false)}
                onUpdated={async (userId, role) => {
                    await onUpdateRole(userId, role)
                    setRoleOpen(false)
                }}
            />
        </>
    )
}