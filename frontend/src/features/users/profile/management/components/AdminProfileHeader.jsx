import { Mail, Phone, Shield, AlertOctagon } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";

export default function AdminProfileHeader({ user }) {
    const roleLabel = {
        admin: "Amministratore",
        librarian: "Bibliotecario",
        student: "Studente",
    }[user.role?.name] ?? user.role?.name;

    const isSuspended = Boolean(user.suspension?.reason || user.suspension?.endDate);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-5">
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold tracking-tight">
                        {user.firstName} {user.lastName}
                    </h1>
                    <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {roleLabel}
                    </Badge>
                    {isSuspended && (
                        <Badge variant="destructive" className="gap-1">
                            <AlertOctagon className="h-3 w-3" />
                            Sospeso
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                    {user.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{user.email}</span>
                        </div>
                    )}
                    {user.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{user.phone}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}