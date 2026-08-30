import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import UserActions from "@/features/users/management/table/UserTableActions.jsx";
import { roleColors, roleLabels } from "@/features/users/management/table/usersTable.constants.js";

export function getUserColumns({ onUpdateRole, onDelete, onSuspend, onUnsuspend, onEdit }) {
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
            id: "status",
            header: "Stato",
            cell: ({ row }) => {
                const suspension = row.original.suspension

                // Se ha una sospensione attiva
                if (!suspension) {
                    return (
                        <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                            Attivo
                        </Badge>
                    )
                }


                const untilLabel = suspension.endDate
                    ? `fino al ${new Date(suspension.endDate).toLocaleDateString("it-IT")}`
                    : "a tempo indeterminato"

                return (
                    <Badge
                        variant="outline"
                        className="border-destructive/20 bg-destructive/10 text-destructive"
                        title={`${suspension.reason ?? "Nessun motivo specificato"} (${untilLabel})`}
                    >
                        Sospeso
                    </Badge>
                )
            },
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
                        onUnsuspend={onUnsuspend}
                        onEdit={onEdit}
                    />
                </div>
            )
        }
    ]
}