import { Badge } from "@/components/ui/badge.jsx";
import { LoanTableActions } from "@/features/loans/management/components/LoanTableActions.jsx";

function isDeletedUser(user) {
    return user?.firstName.toLowerCase() === "deleted" && user?.lastName.toLowerCase() === "user";
}

function deletedUserLabel(user) {
    return `Utente eliminato #${user.id}`;
}

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// Deriva lo stato del prestito dai campi disponibili nel DTO
function getLoanStatus(loan) {
    if (loan.returnDate) return "returned";
    if (loan.dueDate && new Date(loan.dueDate) < new Date()) return "overdue";
    if (loan.dueDate && ((new Date(loan.dueDate) - new Date()) <= 3 * 24 *60 *60 *1000)) return "dueSoon"; // Va in dueSoon da 3 giorni prima che scada
    return "active";
}

const STATUS_CONFIG = {
    active:   { label: "Attivo",   variant: "secondary" },
    dueSoon:  { label: "In scadenza", variant: "warning" },
    overdue:  { label: "In ritardo", variant: "destructive" },
    returned: { label: "Restituito", variant: "outline" },
};

export const getLoansColumns = ({ onEdit, onDelete }) => [
    {
        id: "status",
        header: "Stato",
        cell: ({ row }) => {
            const status = getLoanStatus(row.original);
            const config = STATUS_CONFIG[status];
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
    },
    {
        accessorKey: "item.work.title",
        header: "Opera",
        cell: ({ getValue }) => <span className={"text-sm"}>{getValue()}</span>
    },
    {
        accessorKey: "item.id",
        header: "Copia",
        cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
    },
    {
        accessorKey: "patron",
        header: "Utente",
        cell: ({ getValue }) => {
            const patron = getValue();
            if (isDeletedUser(patron)) {
                return <span className="text-sm text-muted-foreground italic">{deletedUserLabel(patron)}</span>
            }
            return <span className="text-sm">{patron.firstName} {patron.lastName}</span>;
        },
    },
    {
        accessorKey: "librarian",
        header: "Bibliotecario",
        cell: ({ getValue }) => {
            const librarian = getValue();
            return <span className="text-sm text-muted-foreground">{librarian.firstName} {librarian.lastName}</span>;
        },
    },
    {
        accessorKey: "loanDate",
        header: "Data prestito",
        cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue())}</span>,
    },
    {
        accessorKey: "dueDate",
        header: "Scadenza",
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{formatDate(getValue())}</span>,
    },
    {
        accessorKey: "returnDate",
        header: "Restituito il",
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{formatDate(getValue())}</span>,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <LoanTableActions loan={row.original} onEdit={onEdit} onDelete={onDelete} />
        ),
    }
];