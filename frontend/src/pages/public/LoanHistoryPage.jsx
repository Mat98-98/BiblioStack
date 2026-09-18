import LoanHistoryFeature from "@/features/loans/history/LoanHistoryFeature.jsx"
import Navbar from "@/components/layout/navbar/Navbar.jsx";

export default function LoanHistoryPage() {
    return (
    <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 pt-24 pb-8">
            <LoanHistoryFeature />
        </div>
    </main>
    );
}