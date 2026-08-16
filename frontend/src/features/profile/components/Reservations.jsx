import { BookMarked } from "lucide-react";
import ReservationCard from "@/features/profile/components/ReservationCard.jsx";
import { useReservations } from "@/features/profile/hooks/useReservations.js";


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
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground rounded-2xl border border-dashed border-border">
                    <BookMarked className="h-8 w-8 mb-2 opacity-40" />
                    <span className="text-sm">
                        Nessuna prenotazione attiva
                    </span>
                </div>
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