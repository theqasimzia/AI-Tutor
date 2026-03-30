import { Skeleton } from "@/components/ui/skeleton"

export default function ParentDashboardLoading() {
    return (
        <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-6 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-5 w-5 rounded" />
                        </div>
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                ))}
            </div>

            {/* Children snapshots */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-10 w-44 rounded-md" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-56 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Recent alerts */}
            <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
                <Skeleton className="h-6 w-36" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-64" />
                        </div>
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>
        </div>
    )
}
