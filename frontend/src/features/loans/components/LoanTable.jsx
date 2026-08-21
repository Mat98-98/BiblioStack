import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getLoansColumns } from "@/features/loans/components/LoanColumns.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import LoansTableSkeleton from "@/features/loans/components/LoanTableSkeleton.jsx";

export default function LoansTable({ loans, loading, onEdit, onDelete }) {
    const columns = getLoansColumns({ onEdit, onDelete });

    const table = useReactTable({
        data: loans,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) return <LoansTableSkeleton />;

    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id}>
                            {hg.headers.map(h => (
                                <TableHead key={h.id}>
                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground text-sm">
                                Nessun prestito trovato
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}