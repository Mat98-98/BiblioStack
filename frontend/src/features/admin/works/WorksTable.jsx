import { useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Skeleton } from "@/components/ui/skeleton.jsx"
import { MoreHorizontal, Trash2 } from "lucide-react"


function WorkActions({ work, onDelete }) {
    const [deleteOpen, setDeleteOpen]   = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Elimina
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Elimina opera</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sei sicuro di voler eliminare {work.title}? L'operazione è irreversibile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(work.id)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Elimina
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
        </div>
    )
}

export default function WorksTable({ works, loading, onDelete }) {
    const columns = [
        {
            id: "work",
            header: "Opera",
            cell: ({ row }) => {
                const w = row.original
                return (
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">
                            {w.title}
                        </span>
                    </div>
                )
            }
        },
        {
            id: "author",
            header: "Autore",
            cell: ({ row }) => {
                const authors = row.original.authors

                return (
                    <div className="flex items-center gap-3">
                <span className="font-medium text-sm">
                    {authors?.length
                        ? authors.map(a => `${a.firstName} ${a.lastName}`).join(", ")
                        : "Autore sconosciuto"}
                </span>
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <WorkActions
                        work={row.original}
                        onDelete={onDelete}
                    />
                </div>
            )
        }
    ]

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