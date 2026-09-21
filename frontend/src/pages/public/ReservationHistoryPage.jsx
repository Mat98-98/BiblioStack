import ReservationHistoryFeature from "@/features/reservations/history/ReservationHistoryFeature.jsx"
import Navbar from "@/components/layout/navbar/Navbar.jsx";

export default function ReservationHistoryPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 pt-24 pb-8">
                <ReservationHistoryFeature />
            </div>
        </main>
    );
}