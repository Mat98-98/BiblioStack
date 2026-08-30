import { useState } from "react";
import { AlertTriangle, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { ActionsMenu } from "@/components/common/dialogs/ActionsMenu.jsx";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu.jsx";
import { DeleteConfirmDialog } from "@/components/common/dialogs/DeleteConfirmDialog.jsx";
import EditLoanDialog from "@/features/loans/management/components/EditLoanDialog.jsx";
import CheckInDialog from "@/features/loans/management/components/CheckInDialog.jsx";
import NoticeDialog from "@/features/notices/dialogs/NoticeDialog.jsx";


export function LoanTableActions({ loan, onEdit, onDelete, onNotify }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [noticeOpen, setNoticeOpen] = useState(false);

    const isReturned = Boolean(loan.returnDate);

    return (
        <>
            <ActionsMenu>
                {!isReturned && (
                    <>
                    <DropdownMenuItem onClick={() => setCheckInOpen(true)}>
                        <RotateCcw className="mr-2 h-4 text-primary"/>
                        Riconsegna
                    </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifica
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNoticeOpen(true)}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Segnala
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Elimina
                </DropdownMenuItem>
            </ActionsMenu>

            <CheckInDialog
                open={checkInOpen}
                onClose={() => setCheckInOpen(false)}
                loan={loan}
                onSuccess={onEdit}
                onNotify={onNotify}
            />

            <NoticeDialog
                loan={loan}
                open={noticeOpen}
                onClose={() => setNoticeOpen(false)}
                onConfirm={onNotify}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Elimina prestito"
                description={`Sei sicuro di voler eliminare il prestito della copia ${loan.item.id}? L'operazione è irreversibile.`}
                onConfirm={() => onDelete(loan.id)}
            />

            <EditLoanDialog loan={loan} open={editOpen} onClose={() => setEditOpen(false)} onConfirm={onEdit} />
        </>
    );
}