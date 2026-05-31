import { useEffect, useState } from "react"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import WorkCard from "@/components/common/works/cards/WorkCard.jsx"
import { Skeleton } from "@/components/ui/skeleton.jsx"
import { cn } from "@/lib/utils.js"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel.jsx"


function WorkCarouselSkeleton() {
    return (
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 min-w-40">
                    <Skeleton className="aspect-2/3 rounded-2xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            ))}
        </div>
    )
}

export default function WorkCarousel({
                                         title = "Works",
                                         works = [],
                                         loading = false,
                                         error = null,
                                         limit = 8
                                     }) {
    const displayed = works.slice(0, limit)
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) return

        const onSelect = () => setCurrent(api.selectedScrollSnap())

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", onSelect)
        api.on("reInit", onSelect)

        return () => {
            api.off("select", onSelect)
            api.off("reInit", onSelect)
        }
    }, [api])

    return (
        <section className="mx-auto w-full 2xl:: max-w-9/10 px-6 py-8 space-y-6">
            <h2 className="text-2xl font-bold">{title}</h2>

            {loading && <WorkCarouselSkeleton />}

            {error && (
                <p className="text-sm text-muted-foreground">
                    Errore nel caricamento dei contenuti.
                </p>
            )}

            {!loading && !error && (
                <div className="space-y-4">
                    <Carousel
                        setApi={setApi}
                        plugins={[WheelGesturesPlugin()]}
                        opts={{
                            align: "start",
                            containScroll: "trimSnaps",
                            dragFree: true,
                            watchDrag: true,
                            duration: 25
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2">
                            {displayed.map((work) => (
                                <CarouselItem
                                    key={work.id}
                                    className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/8"
                                >
                                    <WorkCard work={work} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Wrapper che isola i bottoni dal drag listener di Embla */}
                        <div
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <CarouselPrevious className="hidden sm:flex" />
                            <CarouselNext className="hidden sm:flex" />
                        </div>

                    </Carousel>

                    {/* indicators */}
                    <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => api?.scrollTo(index)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    current === index
                                        ? "w-6 bg-primary"
                                        : "w-2 bg-muted-foreground"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}


/*
import WorkCard from "@/components/works/WorkCard.jsx"
import { Skeleton } from "@/components/ui/skeleton.jsx"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel.jsx"

function BookCarouselSkeleton() {
    return (
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 min-w-[160px]">
                    <Skeleton className="aspect-[2/3] rounded-2xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            ))}
        </div>
    )
}

export default function BookCarousel({ title = "Libri in evidenza", limit = 10 }) {
    const { books, loading, error } = useBooks()
    const displayed = books.slice(0, limit)

    return (
        <section className="mx-auto max-w-7xl px-6 py-8 space-y-6">
            <h2 className="text-2xl font-bold">{title}</h2>

            {loading && <BookCarouselSkeleton />}

            {error && (
                <p className="text-sm text-muted-foreground">
                    Errore nel caricamento del catalogo.
                </p>
            )}

            {!loading && !error && (
                <Carousel
                    opts={{ align: "start", dragFree: true }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2">
                        {displayed.map((work) => (
                            <CarouselItem
                                key={work.id}
                                className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                                <WorkCard work={work} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            )}
        </section>
    )
}
*/