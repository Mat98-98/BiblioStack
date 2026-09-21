import { Button } from "@/components/ui/button.jsx";
import { UserCog, ShieldOff, ShieldAlert } from "lucide-react";

export default function AdminUserActions({ isSuspended, onChangeRole, onSuspend, onUnsuspend }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onChangeRole} className="gap-2">
                <UserCog className="h-4 w-4" />
                Cambia ruolo
            </Button>

            {isSuspended ? (
                <Button variant="outline" size="sm" onClick={onUnsuspend} className="gap-2">
                    <ShieldOff className="h-4 w-4" />
                    Revoca sospensione
                </Button>
            ) : (
                <Button variant="destructive" size="sm" onClick={onSuspend} className="gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Sospendi utente
                </Button>
            )}
        </div>
    );
}