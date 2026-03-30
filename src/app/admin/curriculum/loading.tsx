import { Skeleton } from "@/components/ui/skeleton"

export default function CurriculumLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            {/* Curriculum cards grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border-l-4 border-slate-300 border border-slate-200 p-6 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-9 w-full rounded-lg" />
                            ))}
                        </div>
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    )
}
