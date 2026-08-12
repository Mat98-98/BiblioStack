import { useState } from "react";
import { Mail, Phone, Shield, LucideWrench } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import { useChangePassword } from "@/features/profile/hooks/useChangePassword.js";

export default function ProfileHero({ user }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
    const { sendChangePasswordLink, loading } = useChangePassword();

    const roleLabel = {
        admin: "Amministratore",
        librarian: "Bibliotecario",
        student: "Studente",
    }[user.role?.name] ?? user.role?.name;

    const handleConfirmPasswordReset = async () => {
        const success = await sendChangePasswordLink(user.email);
        if (success) {
            setConfirmOpen(false);
        }
    };

    return (
        <>
            <div className="rounded-3xl border border-border bg-card px-10 py-10 shadow-sm">
                <div className="flex flex-col items-center text-center gap-6">

                    {/* Avatar */}
                    <div className="relative">
                        <Avatar className="h-24 w-24 rounded-3xl">
                            <AvatarFallback className="rounded-3xl bg-primary/10 text-primary text-2xl font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <Badge
                            variant="secondary"
                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1"
                        >
                            <Shield className="h-3 w-3" />
                            {roleLabel}
                        </Badge>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight select-none">
                            {user.firstName} {user.lastName}
                        </h1>
                    </div>

                    {/* Info row */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                        {user.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                        {user.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Action */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-6 gap-2"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <LucideWrench className="h-4 w-4" />
                        Cambia password
                    </Button>

                </div>
            </div>

            {/* Dialog di conferma per il cambio password */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmPasswordReset}
                loading={loading}
                title="Richiedi cambio password"
                description={`Vuoi inviare un'email all'indirizzo ${user.email} con le istruzioni per cambiare la password?`}
                confirmLabel="Invia richiesta"
                cancelLabel="Annulla"
            />
        </>
    );
}