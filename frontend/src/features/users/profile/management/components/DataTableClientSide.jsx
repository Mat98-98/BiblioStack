import { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table.jsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { Input } from "@/components/ui/input.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";


export default function DataTableClientSide({
                                      columns,
                                      data,
                                      searchPlaceholder = "Cerca...",
                                      searchColumnId,
                                      emptyIcon: EmptyIcon,
                                      emptyMessage = "Nessun risultato",
                                      pageSize = 15,
                                      initialSorting = []
                                  }) {
    const [sorting, setSorting] = useState(initialSorting);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
        globalFilterFn: searchColumnId
            ? (row, _columnId, filterValue) => {
                const value = row.getValue(searchColumnId);
                return String(value ?? "").toLowerCase().includes(filterValue.toLowerCase());
            }
            : undefined,
    });

    return (
        <div className="space-y-3">
            {searchColumnId && (
                <Input
                    placeholder={searchPlaceholder}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-xs"
                />
            )}

            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <button
                                                type="button"
                                                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                            </button>
                                        ) : (
                                            flexRender(header.column.columnDef.header, header.getContext())
                                        )}
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
                                            {EmptyIcon && (
                                                <EmptyMedia variant="icon">
                                                    <EmptyIcon />
                                            </EmptyMedia>
                                            )}
                                            <EmptyTitle>{emptyMessage}</EmptyTitle>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
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

            {table.getPageCount() > 1 && (
                <TablePagination
                    page={table.getState().pagination.pageIndex + 1}
                    hasMore={table.getCanNextPage()}
                    onPage={(p) => table.setPageIndex(p-1)}
                    loading={false}
                />
            )}
        </div>
    );
}