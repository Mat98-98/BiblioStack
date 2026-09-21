import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { BookX } from "lucide-react";
import { getReservationColumns } from "@/features/reservations/components/ReservationColumns.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import ReservationsTableSkeleton from "@/features/reservations/components/ReservationTableSkeleton.jsx";

export default function ReservationsTable({
                                              reservations,
                                              loading,
                                              onCancel,
                                              showAllColumns = true
                                          }) {
    const columns = getReservationColumns({
        onCancel,
        showAllColumns
    });

    const table = useReactTable({
        data: reservations,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) return <ReservationsTableSkeleton />;

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
                            <TableCell colSpan={columns.length} className="py-12">
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <BookX />
                                        </EmptyMedia>
                                        <EmptyTitle>Nessuna prenotazione trovata</EmptyTitle>
                                    </EmptyHeader>
                                </Empty>
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
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