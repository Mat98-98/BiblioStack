import { AlertOctagon } from "lucide-react";

export default function SuspensionCard({ suspension }) {
    if (!suspension?.reason && !suspension?.endDate) return null;

    const endDate = suspension.endDate
        ? new Date(suspension.endDate).toLocaleDateString("it-IT", {
            day: "numeric", month: "long", year: "numeric",
        })
        : null;

    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl border border-destructive/30 bg-destructive/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <AlertOctagon className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex flex-col gap-1">
                <span className="font-medium text-destructive">Account sospeso</span>
                {suspension.reason && (
                    <span className="text-sm text-muted-foreground">{suspension.reason}</span>
                )}
                {endDate && (
                    <span className="text-xs text-muted-foreground">Fino al {endDate}</span>
                )}
            </div>
        </div>
    );
}