import { useState } from "react";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { noticesColumns } from "@/features/notices/components/NoticesColumns.jsx";
import { ArrowUpDown, AlertTriangle } from "lucide-react";
import TablePagination from "@/components/common/TablePagination.jsx";

export default function NoticesTable({ notices }) {
    const [sorting, setSorting] = useState([
        { id: "issuedAt", desc: true },
    ]);

    const table = useReactTable({
        data: notices,
        columns: noticesColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : header.column.getCanSort()
                                                ? (
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                                    </button>
                                                )
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getVisibleLeafColumns().length}
                                    className="py-12"
                                >
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <AlertTriangle />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                Nessuna segnalazione
                                            </EmptyTitle>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
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

            {table.getPageCount() > 1 && (
                <TablePagination
                    page={table.getState().pagination.pageIndex + 1}
                    hasMore={table.getCanNextPage()}
                    onPage={(page) => table.setPageIndex(page - 1)}
                    loading={false}
                />
            )}
        </div>
    );
}