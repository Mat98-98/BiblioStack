import Navbar from "@/components/layout/navbar/Navbar.jsx"
import Catalog from "@/features/works/catalog/index.jsx";

export default function CatalogPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto w-full px-4 pt-24 pb-12">
                <Catalog />
            </div>
        </main>
    )
}