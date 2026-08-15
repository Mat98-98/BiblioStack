import {useState} from "react";
import {ActionsMenu} from "@/components/common/dialogs/ActionsMenu.jsx";
import {DropdownMenuItem, DropdownMenuSeparator} from "@/components/ui/dropdown-menu.jsx";
import {DeleteConfirmDialog} from "@/components/common/dialogs/DeleteConfirmDialog.jsx";
import { Pencil, Trash2 } from "lucide-react";
import EditItemDialog from "@/features/works/workDetail/EditItemDialog.jsx";

export function ItemTableActions({ item, onEdit, onDelete }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
        <ActionsMenu>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4"/>
                Modifica
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4"/>
                Elimina
            </DropdownMenuItem>
        </ActionsMenu>

            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={"Elimina copia"}
                description={`Sei sicuro di voler eliminare la copia ${item.id}? L'operazione è irreversibile.`}
                onConfirm={() => onDelete(item.id)}
            />

            <EditItemDialog item={item} open={editOpen} onClose={() => setEditOpen(false)} onConfirm={onEdit}/>
        </>
    );
}