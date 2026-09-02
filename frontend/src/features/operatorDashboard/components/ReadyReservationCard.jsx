import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { safeFormat } from "@/lib/dateUtils.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { PackageCheck, PackageX, CalendarClock } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import ReadyReservationDialog from "@/features/operatorDashboard/components/ReadyReservationDialog.jsx";


export default function ReadyReservationsCard({ reservations, loading }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const hasMore = reservations.length >= 5;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Prenotazioni pronte al ritiro</CardTitle>
                {hasMore && (
                    <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setDialogOpen(true)}>
                        Vedi tutte
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                {loading && Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}

                {!loading && reservations.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PackageX />
                            </EmptyMedia>
                            <EmptyTitle>Nessuna prenotazione da ritirare</EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                )}

                {!loading && reservations.map(reservation => {
                    const copyId = reservation.assignedItem?.id;
                    const schoolName = reservation.assignedItem?.location?.school?.name;

                    return (
                        <div key={reservation.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                            {copyId ? (
                                <PackageCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            ) : (
                                <PackageX className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {reservation.work.title}
                                    {copyId && (
                                        <span className="text-xs text-muted-foreground font-mono"> [{copyId}]</span>
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {reservation.user.firstName} {reservation.user.lastName}
                                    {schoolName && <span className="text-muted-foreground/70"> — presso {schoolName}</span>}
                                </p>
                            </div>
                            {reservation.expiresAt && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                    <CalendarClock className="h-4 w-4 shrink-0" />
                                    {safeFormat(reservation.expiresAt)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </CardContent>

            <ReadyReservationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </Card>
    );
}