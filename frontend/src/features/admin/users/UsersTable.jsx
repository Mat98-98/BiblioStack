import { useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { MoreHorizontal, Shield, Ban, Trash2, Pencil } from "lucide-react";
import SuspendUserDialog from "@/features/admin/users/dialogs/suspendUserDialog/SuspendUserDialog.jsx";
import EditUserDialog from "@/features/admin/users/dialogs/editUserDialog/EditUserDialog.jsx";
import ChangeRoleDialog from "@/features/admin/users/dialogs/changeRoleDialog/ChangeRoleDialog.jsx";

const roleColors = {
    admin:     "border-red-500/20 bg-red-500/10 text-red-600",
    librarian: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    student:   "text-muted-foreground",
}

const roleLabels = {
    admin:     "Admin",
    librarian: "Bibliotecario",
    student:   "Studente",
}

function UserActions({ user, onUpdateRole, onDelete, onSuspend, onEdit }) {
    const [deleteOpen, setDeleteOpen]   = useState(false)
    const [suspendOpen, setSuspendOpen] = useState(false)
    const [editOpen, setEditOpen]       = useState(false)
    const [roleOpen, setRoleOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifica
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setRoleOpen(true)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Cambia ruolo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setSuspendOpen(true)}
                        className="text-orange-600 focus:text-orange-600"
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        Sospendi
                    </DropdownMenuItem>
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
                        <AlertDialogTitle>Elimina utente</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sei sicuro di voler eliminare {user.firstName} {user.lastName}? L'operazione è irreversibile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(user.id)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Elimina
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <SuspendUserDialog
                user={user}
                open={suspendOpen}
                onClose={() => setSuspendOpen(false)}
                onConfirm={onSuspend}
            />

            <EditUserDialog
                user={user}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onConfirm={onEdit}
            />

            <ChangeRoleDialog
                user={user}
                open={roleOpen}
                onClose={() => setRoleOpen(false)}
                onUpdated={async (userId, role) => {
                    await onUpdateRole(userId, role);
                    setRoleOpen(false);
                }}
            />
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

export default function UsersTable({ users, loading, onUpdateRole, onDelete, onSuspend, onEdit }) {
    const columns = [
        {
            id: "user",
            header: "Utente",
            cell: ({ row }) => {
                const u = row.original
                const initials = `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg text-xs bg-primary/10 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                            {u.firstName} {u.lastName}
                        </span>
                    </div>
                )
            }
        },
        {
            id: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.email ?? "—"}
                </span>
            )
        },
        {
            id: "role",
            header: "Ruolo",
            cell: ({ row }) => {
                const role = row.original.role?.name
                return (
                    <Badge variant="outline" className={roleColors[role]}>
                        {roleLabels[role] ?? role}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <UserActions
                        user={row.original}
                        onUpdateRole={onUpdateRole}
                        onDelete={onDelete}
                        onSuspend={onSuspend}
                        onEdit={onEdit}
                    />
                </div>
            )
        }
    ]

    const table = useReactTable({
        data: users,
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
                                Nessun utente trovato
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