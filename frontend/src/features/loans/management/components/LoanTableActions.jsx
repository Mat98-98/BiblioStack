import { useState } from "react";
import { AlertTriangle, Pencil, RotateCcw } from "lucide-react";
import { ActionsMenu } from "@/components/common/dialogs/ActionsMenu.jsx";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";
import EditLoanDialog from "@/features/loans/management/components/EditLoanDialog.jsx";
import CheckInDialog from "@/features/loans/management/components/CheckInDialog.jsx";
import NoticeDialog from "@/features/notices/dialogs/NoticeDialog.jsx";


export function LoanTableActions({ loan, onEdit, onNotify }) {
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

            <EditLoanDialog loan={loan} open={editOpen} onClose={() => setEditOpen(false)} onConfirm={onEdit} />
        </>
    );
}