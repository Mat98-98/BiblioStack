import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";


function TableSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="h-12 w-full rounded-lg"
                />
            ))}
        </div>
    );
}


function EmptyState({
                        icon: EmptyIcon,
                        message,
                    }) {
    if (!EmptyIcon) {
        return (
            <div className="py-12 text-center text-sm text-muted-foreground">
                {message}
            </div>
        );
    }

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <EmptyIcon />
                </EmptyMedia>

                <EmptyTitle>
                    {message}
                </EmptyTitle>
            </EmptyHeader>
        </Empty>
    );
}


export default function DataTable({
                                      data = [],
                                      columns = [],

                                      loading = false,

                                      emptyIcon,
                                      emptyMessage = "Nessun elemento trovato",

                                      skeletonRows = 5,

                                      pagination = null,

                                      className = "",
                                  }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return <TableSkeleton rows={skeletonRows} />;
    }

    const rows = table.getRowModel().rows;

    return (
        <div className={className}>
            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
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
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="py-12"
                                >
                                    <EmptyState
                                        icon={emptyIcon}
                                        message={emptyMessage}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
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

            {pagination && (
                <div className="mt-4">
                    <TablePagination
                        {...pagination}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
}