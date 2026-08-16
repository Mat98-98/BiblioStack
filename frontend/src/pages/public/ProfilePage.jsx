
import { useUserDashboard } from "@/features/profile/hooks/useDashboard.js";
import Navbar from "@/components/layout/navbar/Navbar.jsx";
import Profile from "@/features/profile/ProfileFeature.jsx";

export default function ProfilePage() {
    const { user, loading, error } = useUserDashboard();

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 pt-24 pb-8">
                <Profile user={user} loading={loading} error={error} />
            </div>
        </main>
    );
}