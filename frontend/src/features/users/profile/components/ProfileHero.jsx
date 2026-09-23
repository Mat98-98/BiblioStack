import { useState } from "react";
import { Mail, Phone, Shield, Wrench } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useChangePassword } from "@/features/users/profile/hooks/useChangePassword.js";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import SuspensionAlert from "@/features/users/profile/components/SuspensionAlert.jsx";

export default function ProfileHero({ user }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { sendChangePasswordLink } = useChangePassword();

    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

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
            <section className="rounded-3xl border border-border bg-card px-10 py-10 shadow-sm">
                <div className="flex flex-col items-center gap-6 text-center">

                    <div className="relative">
                        <Avatar className="h-24 w-24 rounded-3xl">
                            <AvatarFallback className="rounded-3xl bg-primary/10 text-2xl font-semibold text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <Badge
                            variant="secondary"
                            className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap"
                        >
                            <Shield className="h-3 w-3" />
                            {roleLabel}
                        </Badge>
                    </div>

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {user.firstName} {user.lastName}
                        </h1>
                    </div>

                    {(user.phone || user.email) && (
                        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                            {user.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{user.phone}</span>
                                </div>
                            )}

                            {user.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>{user.email}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <SuspensionAlert suspension={user.suspension} />

                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full px-6"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Wrench className="h-4 w-4" />
                        Cambia password
                    </Button>
                </div>
            </section>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmPasswordReset}
                title="Richiedi cambio password"
                description={`Vuoi inviare un'email all'indirizzo ${user.email} con le istruzioni per cambiare la password?`}
                confirmLabel="Invia richiesta"
                cancelLabel="Annulla"
            />
        </>
    );
}