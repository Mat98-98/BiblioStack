import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import { useMyCard } from "@/features/qrCode/hooks/useMyCard.js";

export default function CardView() {
    const { token, loading, renewing, renew } = useMyCard();
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (loading) {
        return <Skeleton className="h-64 w-64 rounded-3xl" />;
    }

    if (!token) {
        return (
            <p className="text-sm text-muted-foreground">
                Impossibile caricare la tessera. Riprova più tardi.
            </p>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="rounded-3xl border border-border p-6 bg-primary-foreground shadow-sm">
                <QRCodeSVG value={token} size={200} />
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
                <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={renewing}
                    className="text-xs font-medium text-destructive hover:underline flex items-center gap-1.5 pt-2"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${renewing ? "animate-spin" : ""}`} />
                    Tessera smarrita o compromessa? Richiedi una nuova tessera
                </button>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={renew}
                title="Rinnovare la tessera?"
                description="Il QR attuale, anche se stampato su una tessera fisica, smetterà immediatamente di funzionare. Questa azione non è reversibile."
                confirmLabel="Rinnova"
                variant="destructive"
            />
        </div>
    );
}