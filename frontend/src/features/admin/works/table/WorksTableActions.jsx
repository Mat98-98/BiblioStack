import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import { MoreHorizontal, Pencil, Trash2, BookPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useState } from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import EditWorkDialog from "@/features/admin/works/dialogs/EditWorkDialog.jsx";
import AddItemDialog from "@/features/admin/items/AddItemDialog.jsx";
import {ActionsMenu} from "@/components/common/dialogs/ActionsMenu.jsx";
import {DeleteConfirmDialog} from "@/components/common/dialogs/DeleteConfirmDialog.jsx";

export function WorkActions({ work, onDelete, onEdit }) {
    const [deleteOpen, setDeleteOpen]   = useState(false);
    const [editOpen, setEditOpen]   = useState(false);
    const [addItemOpen, setAddItemOpen]   = useState(false);

    return (
        <>
            <ActionsMenu>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifica
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => setAddItemOpen(true)}>
                    <BookPlus className="mr-2 h-4 w-4" />
                    Aggiungi copia
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Elimina
                </DropdownMenuItem>
            </ActionsMenu>

            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={"Elimina opera"}
                description={`Sei sicuro di voler eliminare ${work.title}? L'opzione è irreversibile.`}
                onConfirm={() => onDelete(work.id)}/>


            <EditWorkDialog
                work={work}
                open={editOpen}
                onClose= {() => setEditOpen(false)}
                onConfirm={onEdit}
            />

            <AddItemDialog
                open={addItemOpen}
                onClose={() => setAddItemOpen(false)}
                workId={work.id}
                workTitle={work.title}
            />
        </>
    )
}