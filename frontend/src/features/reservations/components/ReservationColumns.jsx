import { useState } from "react";
import { ActionsMenu } from "@/components/common/dialogs/ActionsMenu.jsx";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";
import { DeleteConfirmDialog } from "@/components/common/dialogs/DeleteConfirmDialog.jsx";
import { safeFormat } from "@/lib/dateUtils.js";
import { Trash2 } from "lucide-react";
import ReservationStatusBadge from "@/features/reservations/components/ReservationStatusBadge.jsx";


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

export const getReservationColumns = ({
                                          onCancel,
                                          showAllColumns = true
                                      }) => [
    {
        id: "workTitle",
        accessorFn: (row) => row.work?.title ?? "Titolo non disponibile",
        header: "Libro",
        cell: ({ getValue }) => (
            <span className="font-medium max-w-55 truncate block">
                {getValue()}
            </span>
        ),
    },

    {
        id: "assignedItem",
        accessorFn: (row) => row.assignedItem?.id ?? "Nessuna copia assegnata",
        header: "Copia",
        cell: ({ getValue }) => (
            <span className="font-mono text-sm">
                {getValue()}
            </span>
        ),
    },

    ...(showAllColumns ? [{
        id: "user",
        accessorKey: "user",
        header: "Utente",
        cell: ({ getValue }) => {
            const user = getValue();

            if (!user) {
                return (
                    <span className="text-sm text-muted-foreground">
                        —
                    </span>
                );
            }

            return (
                <span className="text-sm">
                    {user.firstName} {user.lastName}
                </span>
            );
        },
    }] : []),

    ...(showAllColumns ? [{
        id: "school",
        accessorFn: (row) =>
            row.assignedItem?.location?.school?.name ?? "—",
        header: "Scuola",
        cell: ({ getValue }) => (
            <span className="text-sm">
                {getValue()}
            </span>
        ),
    }] : []),

    ...(showAllColumns ? [{
        id: "shelfCode",
        accessorFn: (row) =>
            row.assignedItem?.location?.shelfCode ?? "—",
        header: "Scaffale",
        cell: ({ getValue }) => (
            <span className="font-mono text-sm">
                {getValue()}
            </span>
        ),
    }] : []),

    {
        accessorKey: "reservationDate",
        header: "Data prenotazione",
        cell: ({ getValue }) => (
            <span className="text-sm">
                {safeFormat(getValue()) ?? "—"}
            </span>
        ),
        sortingFn: "datetime",
    },

    {
        id: "status",
        header: "Stato",
        enableSorting: false,
        cell: ({ row }) => (
            <ReservationStatusBadge
                status={row.original.status}
                expiresAt={row.original.expiresAt}
            />
        ),
    },

    ...(showAllColumns ? [{
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
            <ReservationRowActions
                reservation={row.original}
                onCancel={onCancel}
            />
        ),
    }] : []),
];