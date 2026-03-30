import { Skeleton } from "@/components/ui/skeleton"

export default function LessonsLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-80" />
            </div>

            {/* Subject tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-28 rounded-full" />
                ))}
            </div>

            {/* Module cards grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
            </div>
        </div>
    )
}
