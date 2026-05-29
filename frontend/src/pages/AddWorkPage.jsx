import Navbar from "@/components/layout/navbar/Navbar.jsx"
import AddWorkFeature from "@/features/works/addWorkPage"

export default function AddWorkPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-2xl px-4 pt-24 pb-12 space-y-8">
                <AddWorkFeature />
            </div>
        </main>
    )
}