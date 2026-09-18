import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getLoansColumns } from "@/features/loans/components/LoanColumns.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { PackageX } from "lucide-react";
import LoansTableSkeleton from "@/features/loans/components/LoanTableSkeleton.jsx";


export default function LoansTable({ loans, loading, onEdit, onDelete, onNotify, showAllColumns = true, showPatron = true }) {
    const columns = getLoansColumns({ onEdit, onDelete, onNotify, showAllColumns, showPatron });

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
                            <TableCell colSpan={columns.length} className="py 12">
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <PackageX />
                                        </EmptyMedia>
                                        <EmptyTitle>Nessun prestito trovato</EmptyTitle>
                                    </EmptyHeader>
                                </Empty>
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