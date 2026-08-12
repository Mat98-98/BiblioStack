import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";

function daysUntil(date) {
    if (!date) return null;

    return Math.max(0, Math.ceil(
        (new Date(date) - new Date()) /
        (1000 * 60 * 60 * 24)
    ));
}

export default function StatusBadge({ status, expiresAt }) {
    const days = daysUntil(expiresAt);

    if (status === "ready") {
        if (days !== null && days <= 2) {
            return (
                <Badge
                    variant="outline"
                    className="gap-1 border-warning text-warning"
                >
                    <AlertTriangle className="h-3 w-3" />
                    Scade {days === 0 ? "oggi" : `tra ${days}g`}
                </Badge>
            );
        }

        return (
            <Badge
                variant="outline"
                className="gap-1 border-success text-success"
            >
                <CheckCircle className="h-3 w-3" />
                Pronto al ritiro
            </Badge>
        );
    }

    if (status === "pending") {
        return (
            <Badge
                variant="outline"
                className="gap-1 text-muted-foreground"
            >
                <Clock className="h-3 w-3" />
                In attesa
            </Badge>
        );
    }

    return null;
}