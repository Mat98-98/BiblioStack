import { useUserDashboard } from "@/features/users/profile/hooks/useDashboard.js";
import Navbar from "@/components/layout/navbar/Navbar.jsx";
import Profile from "@/features/users/profile/ProfileFeature.jsx";

export default function ProfilePage() {
    const { dashboard, loading, error } = useUserDashboard();

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 pt-24 pb-8">
                <Profile dashboard={dashboard} loading={loading} error={error} />
            </div>
        </main>
    );
}