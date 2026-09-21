import {BookMarked, PackageX} from "lucide-react";
import ReservationCard from "@/features/profile/components/ReservationCard.jsx";
import { useReservations } from "@/features/profile/hooks/useReservations.js";
import {Empty, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.jsx";


export default function Reservations({ reservations: initial }) {
    const { reservations, loadingId, cancelReservation } = useReservations(initial);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Prenotazioni
                </h2>
                <span className="text-sm text-muted-foreground">
                    {reservations.length} attive
                </span>
            </div>

            {reservations.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PackageX />
                        </EmptyMedia>
                        <EmptyTitle>Nessuna prenotazione attiva</EmptyTitle>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="flex flex-col gap-2">
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onCancel={cancelReservation}
                            loading={loadingId === reservation.id}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}