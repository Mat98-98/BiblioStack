import { useState } from "react";
import { ActionsMenu } from "@/components/common/dialogs/ActionsMenu.jsx";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";
import { DeleteConfirmDialog } from "@/components/common/dialogs/DeleteConfirmDialog.jsx";
import { Trash2 } from "lucide-react";
import StatusBadge from "@/features/profile/components/StatusBadge.jsx";
import { safeFormat } from "@/lib/dateUtils.js";

function ReservationRowActions({ reservation, onCancel }) {
    const [cancelOpen, setCancelOpen] = useState(false);

    if (!["pending", "ready"].includes(reservation.status)) return null;

    return (
        <>
            <ActionsMenu>
                <DropdownMenuItem
                    onClick={() => setCancelOpen(true)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Annulla prenotazione
                </DropdownMenuItem>
            </ActionsMenu>

            <DeleteConfirmDialog
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                title="Annulla prenotazione"
                description={`Sei sicuro di voler annullare la prenotazione per "${reservation.work?.title ?? "questa opera"}"?`}
                onConfirm={() => onCancel(reservation.id)}
            />
        </>
    );
}

export const buildReservationsColumns = (onCancel) => [
    {
        id: "workTitle",
        accessorFn: (row) => row.work?.title ?? "Titolo non disponibile",
        header: "Opera",
        cell: ({ getValue }) => (
            <span className="font-medium max-w-55 truncate block">{getValue()}</span>
        ),
    },
    {
      id: "assignedItem",
        accessorFn: (row) => row.assignedItem?.id ?? "Nessuna copia assegnata",
        header: "Copia assegnata",
        cell: ({ getValue }) => (
            <span className="font-medium max-w-55 truncate block">{getValue()}</span>
        )
    },
    {
        accessorKey: "reservationDate",
        header: "Prenotato il",
        cell: ({ getValue }) => safeFormat(getValue()) ?? "—",
        sortingFn: "datetime",
    },
    {
        id: "status",
        header: "Stato",
        enableSorting: false,
        cell: ({ row }) => (
            <StatusBadge status={row.original.status} expiresAt={row.original.expiresAt} />
        ),
    },
    {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
            <ReservationRowActions reservation={row.original} onCancel={onCancel} />
        ),
    },
];