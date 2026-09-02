import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import WorkCard from "@/features/works/components/WorkCard.jsx";



function GridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-y-12 2xl:grid-cols-7">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-56 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            ))}
        </div>
    )
}


function EmptyState({ hasFilters }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BookOpen />
                </EmptyMedia>
                <EmptyTitle>Nessun risultato</EmptyTitle>
                <EmptyDescription>
                    {hasFilters ? "Prova a rimuovere qualche filtro" : "Il catalogo è vuoto"}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export default function CatalogGrid({ works, loading, hasFilters }) {
    if (loading) return <GridSkeleton />

    if (works.length === 0) return <EmptyState hasFilters={hasFilters} />

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-x-4 gap-y-8 sm:gap-y-12">
            {works.map(work => (
                <WorkCard key={work.id} work={work} />
            ))}
        </div>
    )
}