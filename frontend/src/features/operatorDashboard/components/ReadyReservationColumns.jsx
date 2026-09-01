import { safeFormat } from "@/lib/dateUtils.js";

export const getReadyReservationColumns = () => [
    {
        id: "work",
        accessorFn: (row) => row.work?.title ?? "Titolo non disponibile",
        header: "Opera",
        cell: ({ getValue}) => <span className="text-sm max-w-50 truncate block">{getValue()}</span>
    },
    {
        id: "copy",
        accessorFn: (row) => row.assignedItem?.id ?? null,
        header: "Copia",
        cell: ({ getValue}) => {
            const copyId = getValue();
            if (!copyId) return <span className="text-sm text-muted-foreground italic">Non assegnata</span>;
            return <span className="font-mono text-sm">{copyId}</span>;
        }
    },
    {
        id: "location",
        accessorFn: (row) => {
            const shelfCode = row.assignedItem?.location?.shelfCode;
            const schoolName = row.assignedItem?.location?.school?.name;
            return [schoolName, shelfCode].filter(Boolean).join(" · ");
        },
        header: "Collocazione",
        cell:({ getValue }) => {
            const value = getValue();
            return value
            ? <span className="text-sm text-muted-foreground max-w-40 truncate block">{value}</span>
                : <span className="text-sm text-muted-foreground">-</span>;
        }
    },
    {
        id: "user",
        accessorFn: (row) => `${row.user?.firstName ?? ""} ${row.user?.lastName ?? ""}`.trim(),
        header: "Utente",
        cell: ({ getValue }) => <span className="text-sm">{getValue() || "-"}</span>
    },
    {
        accessorKey: "expiresAt",
        header: "Scadenza",
        cell: ({ getValue }) => (<span className="text-sm text-muted-foreground">{getValue() ? safeFormat(getValue()) : "-"}</span>),
        sortingFn: "datetime"
    }
]