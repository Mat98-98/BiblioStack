import { useAuth } from "@/context/AuthContext.jsx"

import ProfileHero from "@/features/profile/ProfileHero";
import ActiveLoans from "@/features/profile/ActiveLoans";
import LoanHistory from "@/features/profile/LoanHistory";

import { Skeleton } from "@/components/ui/skeleton.jsx";

import { useUserDashboard } from "@/features/profile/useDashboard.js";
import Navbar from "@/components/layout/navbar/Navbar.jsx";
import Reservations from "@/features/profile/Reservations.jsx";

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
    );
}

export default function ProfilePage() {
    const { user, loading, error } = useUserDashboard();

    if (loading) return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <ProfileSkeleton />
        </div>
    );

    if (error) return (
        <div className="mx-auto max-w-3xl px-4 py-8 text-center text-muted-foreground">
            Errore nel caricamento del profilo.
        </div>
    );

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 pt-24 pb-8 space-y-8">
                <ProfileHero user={user} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ActiveLoans loans={user.loansAsPatron} />
                    <Reservations reservations={user.reservations} />
                </div>

                <LoanHistory loans={user.loansAsPatron} />
            </div>
        </main>
    )
}