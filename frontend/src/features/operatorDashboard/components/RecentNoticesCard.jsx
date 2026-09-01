import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { safeFormat } from "@/lib/dateUtils.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { FileWarning } from "lucide-react";

export default function RecentNotices({ notices, loading }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Segnalazioni recenti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {loading && Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}

                {!loading && notices.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">Nessuna segnalazione recente</p>
                )}

                {!loading && notices.map(notice => (
                    <div key={notice.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <FileWarning className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                                {notice.user.firstName} {notice.user.lastName} · {notice.type.name}
                            </p>
                            {notice.description && (
                                <p className="text-xs text-muted-foreground truncate">{notice.description}</p>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{safeFormat(notice.issuedAt)}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}