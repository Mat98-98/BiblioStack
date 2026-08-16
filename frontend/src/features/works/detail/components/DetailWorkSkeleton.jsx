import {Skeleton} from "@/components/ui/skeleton.jsx";

export default function DetailWorkDetailSkeleton() {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-48 h-72 rounded-2xl shrink-0 mx-auto md:mx-0" />
            <div className="flex flex-col gap-4 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}