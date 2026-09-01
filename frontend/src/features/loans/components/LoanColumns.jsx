import { Badge } from "@/components/ui/badge.jsx";
import { daysUntil, safeFormat } from "@/lib/dateUtils.js";
import { LoanTableActions } from "@/features/loans/management/components/LoanTableActions.jsx";

function isDeletedUser(user) {
    return user?.firstName.toLowerCase() === "deleted" && user?.lastName.toLowerCase() === "user";
}

function deletedUserLabel(user) {
    return `Utente eliminato #${user.id}`;
}


function LoanStatusBadge({ loan }) {
    if (loan.returnDate) {
        const late = loan.dueDate && new Date(loan.returnDate) > new Date(loan.dueDate);
        return late
            ? <Badge variant="outline" className="border-warning text-warning">Restituito in ritardo</Badge>
            : <Badge variant="outline" className="text-muted-foreground">Restituito</Badge>;
    }

    const days = daysUntil(loan.dueDate);
    if (days !== null && days < 0) {
        return <Badge variant="destructive">Scaduto da {Math.abs(days)}g</Badge>;
    }

    if (days !== null && days === 0) {
        return <Badge variant="outline" className="border-warning text-warning">Scade oggi</Badge>;
    }

    if (days !== null && days <= 3) {
        return <Badge variant="outline" className="border-warning text-warning">Scade tra {days}g</Badge>;
    }
    return <Badge variant="outline" className="border-primary text-primary">In corso</Badge>;
}

// showPatron: false quando la tabella è già scoped a un singolo utente (es. dashboard admin utente) 
export const getLoansColumns = ({ onEdit, onDelete, onNotify, showPatron = true }) => [
    {
        id: "status",
        header: "Stato",
        enableSorting: false,
        cell: ({ row }) => <LoanStatusBadge loan={row.original} />,
    },
    {
        id: "workTitle",
        accessorFn: (row) => row.item?.work?.title ?? "Titolo non disponibile",
        header: "Opera",
        cell: ({ getValue }) => <span className="text-sm max-w-55 truncate block">{getValue()}</span>,
    },
    {
        accessorKey: "item.id",
        header: "Copia",
        cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
    },
    ...(showPatron ? [{
        accessorKey: "patron",
        header: "Utente",
        cell: ({ getValue }) => {
            const patron = getValue();
            if (isDeletedUser(patron)) {
                return <span className="text-sm text-muted-foreground italic">{deletedUserLabel(patron)}</span>;
            }
            return <span className="text-sm">{patron.firstName} {patron.lastName}</span>;
        },
    }] : []),
    {
        accessorKey: "librarian",
        header: "Bibliotecario",
        cell: ({ getValue }) => {
            const librarian = getValue();
            if (!librarian) return <span className="text-sm text-muted-foreground">—</span>;
            return <span className="text-sm text-muted-foreground">{librarian.firstName} {librarian.lastName}</span>;
        },
    },
    {
        accessorKey: "loanDate",
        header: "Data prestito",
        cell: ({ getValue }) => <span className="text-sm">{safeFormat(getValue()) ?? "—"}</span>,
        sortingFn: "datetime",
    },
    {
        accessorKey: "dueDate",
        header: "Scadenza",
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{safeFormat(getValue()) ?? "—"}</span>,
        sortingFn: "datetime",
    },
    {
        accessorKey: "returnDate",
        header: "Restituito il",
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{safeFormat(getValue()) ?? "—"}</span>,
        sortingFn: "datetime",
    },
    {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
            <LoanTableActions loan={row.original} onEdit={onEdit} onDelete={onDelete} onNotify={onNotify} />
        ),
    }
];