import { Skeleton } from "@/components/ui/skeleton.jsx";

export default function LoansTableSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
        </div>
    );
}