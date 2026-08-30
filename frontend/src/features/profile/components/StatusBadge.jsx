import { CheckCircle, Clock, AlertTriangle, BookX } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { daysUntil } from "@/lib/dateUtils.js";

export default function StatusBadge({ status, expiresAt }) {
    const days = daysUntil(expiresAt);

    if (status === "ready") {
        if (days !== null && days <= 2) {
            return (
                <Badge
                    variant="outline"
                    className="gap-1 border-warning text-warning"
                >
                    <AlertTriangle className="h-4 w-4" />
                    Scade {days === 0 ? "oggi" : `tra ${days}g`}
                </Badge>
            );
        }

        return (
            <Badge
                variant="outline"
                className="gap-1 border-success text-success"
            >
                <CheckCircle className="h-4 w-4" />
                Pronto al ritiro
            </Badge>
        );
    }

    if (status === "pending") {
        return (
            <Badge
                variant="outline"
                className="gap-1 text-muted-foreground border-muted-foreground"
            >
                <Clock className="h-4 w-4" />
                In attesa
            </Badge>
        );
    }

    if (status === "expired") {
        return (
            <Badge
                variant="outline"
                className="gap-1 text-destructive border-destructive"
            >
                <Clock className="h-4 w-4" />
                Scaduta
            </Badge>
        );
    }

    if (status === "cancelled") {
        return (
            <Badge
                variant="outline"
                className="gap-1 text-muted-foreground bg-muted border-muted-foreground"
            >
                <BookX className="h-4 w-4" />
                Annullata
            </Badge>
        );
    }

    return null;
}