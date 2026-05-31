import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import WorkCard from "@/components/common/works/cards/WorkCard.jsx";

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
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <BookOpen className="h-10 w-10 mb-3 opacity-30" />
            <span className="text-sm font-medium">Nessun risultato</span>
            <span className="text-xs mt-1">
                {hasFilters ? "Prova a rimuovere qualche filtro" : "Il catalogo è vuoto"}
            </span>
        </div>
    )
}

export default function CatalogGrid({ works, loading, hasFilters }) {
    if (loading) return <GridSkeleton />

    if (works.length === 0) return <EmptyState hasFilters={hasFilters} />

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-y-12 2xl:grid-cols-7">
            {works.map(work => (
                <WorkCard key={work.id} work={work} />
            ))}
        </div>
    )
}

/*
import { BookOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton.jsx"
import WorkCard from "@/components/works/WorkCard.jsx"

function GridSkeleton() {
    return (
        <div className="
            grid
            grid-cols-[repeat(auto-fill,minmax(160px,1fr))]
            gap-x-4
            gap-y-10
        ">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            ))}
        </div>
    )
}

function EmptyState({ hasFilters }) {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-muted-foreground">
            <BookOpen className="h-11 w-11 mb-3 opacity-30" />
            <span className="text-sm font-medium">Nessun risultato</span>
            <span className="text-xs mt-1">
                {hasFilters
                    ? "Prova a rimuovere qualche filtro"
                    : "Il catalogo è vuoto"}
            </span>
        </div>
    )
}

export default function CatalogGrid({ works, loading, hasFilters }) {
    if (loading) return <GridSkeleton />
    if (works.length === 0) return <EmptyState hasFilters={hasFilters} />

    return (
        <div className="
            grid
            grid-cols-[repeat(auto-fill,minmax(160px,1fr))]
            gap-x-5
            gap-y-10
        ">
            {works.map(work => (
                <WorkCard key={work.id} work={work} />
            ))}
        </div>
    )
}
 */