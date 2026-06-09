import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/navbar/Navbar.jsx";
import WorkDetail from "@/features/works/workDetail/WorkDetail.jsx";
import { useWorkDetail } from "@/features/works/workDetail/useWorkDetail.js";

export default function WorkDetailPage() {
    const { id } = useParams()
    const { work, loading, error } = useWorkDetail(id)

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-4xl px-4 pt-24 pb-12">
                <WorkDetail work={work} loading={loading} error={error} />
            </div>
        </main>
    )
}