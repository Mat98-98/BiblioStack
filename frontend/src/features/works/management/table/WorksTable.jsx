import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { getWorkColumns } from "@/features/works/management/table/WorksTableColumns.jsx";


function TableSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
        </div>
    )
}

export default function WorksTable({ works, loading, onDelete, onEdit }) {
    const columns = getWorkColumns( { onDelete, onEdit } );

    const table = useReactTable({
        data: works,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (loading) return <TableSkeleton />

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
                                Nessuna opera trovata
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
    )
}