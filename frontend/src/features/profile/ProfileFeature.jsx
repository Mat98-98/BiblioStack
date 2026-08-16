import { Skeleton } from "@/components/ui/skeleton.jsx";
import ProfileHero from "@/features/profile/components/ProfileHero.jsx";
import ActiveLoans from "@/features/profile/components/ActiveLoans.jsx";
import Reservations from "@/features/profile/components/Reservations.jsx";
import LoanHistory from "@/features/profile/components/LoanHistory.jsx";

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
    );
}

export default function Profile({ user, loading, error }) {
    if (loading) return <ProfileSkeleton />;

    if (error || !user) {
        return (
            <div className="text-center text-muted-foreground py-12">
                Errore nel caricamento del profilo.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ProfileHero user={user} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ActiveLoans loans={user.loansAsPatron} />
                <Reservations reservations={user.reservations} />
            </div>

            <LoanHistory loans={user.loansAsPatron} />
        </div>
    );
}