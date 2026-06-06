import { useMemo, useState } from "react";
import {
    BookMarked,
    Clock,
    CheckCircle,
    Trash2,
    AlertTriangle
} from "lucide-react";

import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";

import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";

function daysUntil(date) {
    if (!date) return null

    return Math.max(0, Math.ceil(
        (new Date(date) - new Date()) /
        (1000 * 60 * 60 * 24)
    ))
}

function StatusBadge({ status, expiresAt }) {
    const days = daysUntil(expiresAt)

    if (status === "ready") {

        if (days !== null && days <= 2) {
            return (
                <Badge
                    variant="outline"
                    className="gap-1 border-orange-500 text-orange-500"
                >
                    <AlertTriangle className="h-3 w-3" />
                    Scade {days === 0 ? "oggi" : `tra ${days}g`}
                </Badge>
            )
        }

        return (
            <Badge
                variant="outline"
                className="gap-1 border-green-500 text-green-500"
            >
                <CheckCircle className="h-3 w-3" />
                Pronto al ritiro
            </Badge>
        )
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
        )
    }

    return null
}

function ReservationCard({ reservation, onCancelled }) {
    const [loading, setLoading] = useState(false)

    const reservationDate = new Date(
        reservation.reservationDate
    ).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    const handleCancel = async () => {
        setLoading(true)

        try {
            await api.patch(
                `/reservations/${reservation.id}`,
                { status: "cancelled" }
            )

            notify.success("Prenotazione annullata")

            onCancelled(reservation.id)

        } catch {
            notify.error("Errore nell'annullamento")

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookMarked className="h-5 w-5 text-primary" />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">

                <span className="font-medium truncate">
                    {reservation.work?.title ??
                        "Titolo non disponibile"}
                </span>

                <span className="text-xs text-muted-foreground">
                    Prenotato il {reservationDate}
                </span>

            </div>

            <div className="flex items-center gap-2 shrink-0">

                <StatusBadge
                    status={reservation.status}
                    expiresAt={reservation.expiresAt}
                />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>

            </div>
        </div>
    )
}

export default function Reservations({ reservations: initial }) {
    const [reservations, setReservations] = useState(initial)

    // Mostra SOLO pending e ready
    const visibleReservations = reservations.filter((reservation) =>
        ["pending", "ready"].includes(reservation.status)
    )

    const handleCancelled = (id) => {
        setReservations((prev) =>
            prev.filter((r) => r.id !== id)
        )
    }

    return (
        <section className="space-y-4">

            <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                    Prenotazioni
                </h2>

                <span className="text-sm text-muted-foreground">
                    {visibleReservations.length} attive
                </span>

            </div>

            {visibleReservations.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground rounded-2xl border border-dashed border-border">

                    <BookMarked className="h-8 w-8 mb-2 opacity-40" />

                    <span className="text-sm">
                        Nessuna prenotazione attiva
                    </span>

                </div>

            ) : (

                <div className="flex flex-col gap-2">

                    {visibleReservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onCancelled={handleCancelled}
                        />
                    ))}

                </div>

            )}

        </section>
    )
}