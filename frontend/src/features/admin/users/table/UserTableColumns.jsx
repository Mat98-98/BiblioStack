import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import UserActions from "@/features/admin/users/table/UserTableActions.jsx";
import { roleColors, roleLabels } from "@/features/admin/users/table/usersTable.constants.js";

export function getUserColumns({ onUpdateRole, onDelete, onSuspend, onEdit }) {
    return [
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
}