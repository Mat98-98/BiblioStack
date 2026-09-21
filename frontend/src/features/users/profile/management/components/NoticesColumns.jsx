import { safeFormat } from "@/lib/dateUtils.js";

export const noticesColumns = [
    {
        id: "type",
        accessorFn: (row) => row.type?.name ?? "Segnalazione",
        header: "Tipo",
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    },
    {
        accessorKey: "issuedAt",
        header: "Data",
        cell: ({ getValue }) => safeFormat(getValue()) ?? "—",
        sortingFn: "datetime",
    },
];