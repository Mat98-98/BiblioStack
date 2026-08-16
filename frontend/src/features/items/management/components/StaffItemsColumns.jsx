import { School, MapPin } from "lucide-react";
import { ItemTableActions } from "@/features/items/management/components/ItemTableActions.jsx";

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatPrice(price) {
    if (price == null) return "—";
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
    }).format(price);
}

export const getStaffItemsColumns = ({ isAdmin = false, onEdit, onDelete } = {}) => {
    const columns = [
        {
            accessorKey: "available",
            header: "Stato",
            cell: ({ getValue }) => {
                const available = getValue();
                return (
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${available ? "bg-success" : "bg-destructive"}`} />
                        <span className="text-xs text-muted-foreground">
                            {available ? "Disponibile" : "Non disponibile"}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "id",
            header: "Codice inventario",
            cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
        },
        {
            id: "shelfCode",
            accessorFn: (row) => row.location?.shelfCode ?? null,
            header: "Collocazione",
            cell: ({ getValue }) => (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
                    {getValue() ?? "Non collocato"}
        </span>
            ),
        },
        {
            id: "school",
            accessorFn: (row) => row.location?.school?.name ?? null,
            header: "Scuola",
            cell: ({ getValue }) => (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <School className="h-3.5 w-3.5" />
                    {getValue() ?? "—"}
        </span>
            ),
        },
        {
            accessorKey: "price",
            header: "Prezzo",
            cell: ({ getValue }) => <span className="text-sm">{formatPrice(getValue())}</span>,
        },
        {
            accessorKey: "acquisitionDate",
            header: "Data acquisto",
            cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{formatDate(getValue())}</span>,
        },
    ];

    if (isAdmin) {
        columns.push({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <ItemTableActions item={row.original} onEdit={onEdit} onDelete={onDelete} />
            ),
        });
    }

    return columns;
};