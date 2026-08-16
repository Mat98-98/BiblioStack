// features/works/workDetail/StaffItemsTable.jsx
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { getStaffItemsColumns } from "@/features/items/management/components/StaffItemsColumns.jsx";

export default function StaffItemsTable({ items, isAdmin = false, onEdit, onDelete }) {
    const columns = getStaffItemsColumns({ isAdmin, onEdit, onDelete });

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full border-t pt-8">
            <h2 className="text-xl font-semibold text-muted-foreground mb-4">
                Copie ({items.length})
            </h2>

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
                                    Nessuna copia registrata
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
        </div>
    );
}